<?php

namespace App\Bio;
use Underscore\Types\Arrays;

/**
 * Class BioUtil - offers static utility functions
 * cannot be instantiated, can be extended
 * @package App\Bio
 */
abstract class BioUtil
{
  /**
   * Measure of motif similarity. Based on consensus motif seq.
   * @param $motifs
   * @return int
   */
  public static function score_motifs($motifs) {
    $score = 0;
    $bases = ['A','C','G','T'];
    $counts = [0,0,0,0];
    for ($j = 0; $j < strlen($motifs[0]); $j++) {
      for ($i = 0; $i < sizeof($motifs); $i++) {
        // must be A,C,G, or T
        $counts[array_search($motifs[$i][$j], $bases)]++;
      }
      $score += max($counts);
      $counts = [0,0,0,0];
    }
    return $score;
  }

  /**
   * Construct 4 * k frequency profile from kmer motifs
   * @param $motifs
   * @return array
   */
  public static function profile($motifs) {
    $pf = [[],[],[],[]];
    $bases = ['A','C','G','T'];
    $counts = [0,0,0,0];
    $k = strlen($motifs[0]);
    $num_motifs = sizeof($motifs);
    for ($j = 0; $j < $k; $j++) {
      // calculate counts on first column iteration
      for ($i = 0; $i < $num_motifs; $i++) {
        $counts[array_search($motifs[$i][$j], $bases)]++;
      }
      // insert frequencies on second column iteration
      for ($i = 0; $i < sizeof($counts); $i++) {
        array_push($pf[$i], $counts[$i] / $num_motifs);
      }
      $counts = [0,0,0,0];
    }
    return $pf;
  }

  /**
   * Find best fit k-mer motifs against a 4 * k profile & n dna seqs
   * @param $profile
   * @param $dna
   * @return array
   */
  public static function motifs($profile, $dna) {
    $motifs = [];
    $k = sizeof($profile[0]);
    $bases = ['A','C','G','T'];
    foreach ($dna as $seq) {
      $best = ["score" => 0, "position" => 0];
      for ($i = 0; $i < strlen($seq) - $k + 1; $i++) {
        $pattern = substr($seq, $i, $k);
        $score = 0;
        for ($s = 0; $s < strlen($pattern); $s++) {
          $base = array_search($pattern[$s], $bases);
          $score += $profile[$base][$s];
        }
        if ($score > $best["score"]) {
          $best["score"] = $score;
          $best["position"] = $i;
        }
      }
      array_push($motifs, substr($seq, $best['position'], $k));
    }
    return $motifs;
  }

  public static function neighbors($pattern, $d)
  {
    if ($d < 1) return [$pattern];
    else if (strlen($pattern) < 2) return ['A','C','T','G'];
    $neighborhood = [];
    $sneighborhood = BioUtil::neighbors(suffix($pattern), $d);
    foreach($sneighborhood as $suff) {
      if (BioUtil::hamming_distance($suff, suffix($pattern)) < $d) {
        foreach(['A','C','T','G'] as $b) {
          array_push($neighborhood, $b.$suff);
        }
      }
      else {
        array_push($neighborhood, $pattern[0].$suff);
      }
    }
    return $neighborhood;
  }

  public static function hamming_distance($str1, $str2)
  {
    $editlength = 0;
    for ($i = 0; $i < strlen($str1); $i++) {
      if ($str1[$i] !== $str2[$i]) $editlength++;
    }
    return $editlength;
  }

  public static function approximate_frequency($genome, $pattern, $d, $count = false)
  {
    $res = $count ? 0 : [];
    for ($i = 0; $i < strlen($genome) - strlen($pattern) + 1; $i++) {
      $subseq = substr($genome, $i, strlen($pattern));
      if (BioUtil::hamming_distance($pattern, $subseq) <= $d) {
        if ($count) {
          $res++;
        }
        else {
          array_push($res, $i);
        }
      }
    }
    return $res;
  }
}

function suffix($str)
{
  return substr($str, 1, strlen($str));
}

if (realpath($argv[0] == __FILE__)) {
  foreach (array_slice([1, 2, 3, 4, 5], 0, -1) as $num) echo $num;
}