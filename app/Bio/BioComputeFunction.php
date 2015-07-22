<?php

namespace App\Bio;

interface BioComputeFunction {
  public function compute(array $lines);
}