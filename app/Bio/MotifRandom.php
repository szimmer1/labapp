<?php

namespace App\Bio;

use BioUtil;

class MotifRandom implements BioComputeFunction {
  /**
   * Randomized Motif Search - input n upstream sequences, output best motif set
   *  w/ requirement that all sequences must have the motif
   * @param array $lines
   * @return array
   */
  public function compute(array $lines) {
    list($k, $t) = array_map(function($s) { return (int) $s;}, explode(" ",$lines[0]));
    $dna = array_filter(array_slice($lines,1), function($s) { return strlen($s) > 0; });
    $motifs = [];

    // random select motifs
    foreach($dna as $seq) {
      $randpos = rand(0,strlen($seq) - $k);
      array_push($motifs, substr($seq, $randpos, $k));
    }
    $score = $lastScore = BioUtil::score_motifs($motifs);

    // while score > lastScore, reiterate profile and choose motifs
    do {
      $lastScore = $score;
      $profile = BioUtil::profile($motifs);
      $motifs = BioUtil::motifs($profile, $dna);
      $score = BioUtil::score_motifs($motifs);
    } while ($score > $lastScore);

    return $motifs;
  }
}