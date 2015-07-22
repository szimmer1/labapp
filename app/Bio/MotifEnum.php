<?php

namespace App\Bio;

use Underscore\Types\Arrays;

class MotifEnum implements BioComputeFunction {
  /**
   * Find all k-mer motifs - input dna,k,d - output
   * @param array $lines
   * @return array
   */
  public function compute(array $lines) {
    list($k, $d) = array_map(function($val) {
      return (int) $val;
    }, explode(' ',$lines[0]));

    $strings = [];
    $l = count($lines);
    for ($i = 1; $i < $l; $i++) {
      if (!empty($lines[$i])) array_push($strings, $lines[$i]);
    }


    $motifs = [];
    for ($i = 0; $i < strlen($strings[0]) - $k + 1; $i++) {
      $patt = substr($strings[0], $i, $k);

      $neighbors = BioUtil::neighbors($patt, $d);

      foreach($neighbors as $nb) {

        if (Arrays::matches($strings, function($str) use ($nb,$d) {
            return BioUtil::approximate_frequency($str, $nb, $d, true) > 0;
          }) &&
            !Arrays::contains($motifs, $nb)) {
          array_push($motifs, $nb);
        }
      }
    }

    return $motifs;
  }
}
