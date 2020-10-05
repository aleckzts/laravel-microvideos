<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;

trait UploadFiles
{
  public static function uploadFiles(array $files)
  {
    foreach ($files as $file) {
        $this->uploadFile($file);
    }
  }

  public static function uploadFile(UploadedFile $file)
  {
    $file->store();
  }
}
