<?php


namespace App\Traits;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

trait UploadFile
{
    public function uploadFile(FormRequest $formRequest, $destinationDir = '/files', $fileKey = 'file')
    {
        if ($formRequest->hasFile($fileKey)) {
            $posted_file = $formRequest->file($fileKey);
            $posted_file->getFilename();
            $posted_file_name = Str::random(30) . '.' . $posted_file->getClientOriginalExtension();
            $destinationPath = public_path($destinationDir);
            $posted_file->move($destinationPath, $posted_file_name);
            $file_path = $destinationPath . '/' . $posted_file_name;
            $file_uri = $destinationDir . '/' . $posted_file_name;
            return [
                'directory' => $destinationDir,
                'file_name' => $posted_file_name,
                //'file_path' => $file_path,
                'file_url' => $file_uri
            ];
        } else {
            return null;
        }
    }
}
