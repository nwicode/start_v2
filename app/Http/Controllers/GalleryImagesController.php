<?php

namespace App\Http\Controllers;

use App\Helpers\AdobeCreativeCloudCtl;
use App\Http\Requests\AdobeRequests\GetAdobeAccessToken;
use App\Http\Requests\AdobeRequests\GetAdobeImageBase64;
use App\Http\Requests\GalleryImages\GetAdobeImages;
use App\Http\Requests\GalleryImages\GetGalleryImagesRequest;
use App\Http\Requests\GalleryImages\UploadFileRequest;
use App\Http\Requests\GetAdobeLibrariesRequests;
use App\Traits\UploadFile;
use Illuminate\Support\Facades\File;
use App\Models\Application;

class GalleryImagesController extends Controller
{
    use UploadFile;

    /**
     * @var AdobeCreativeCloudCtl
     */
    private $adobeCC;
    /**
     * @var string
     */
    private $authClientId;
    /**
     * @var string
     */
    private $authClientSecret;

    /**
     * GalleryImagesController constructor.
     */
    public function __construct()
    {
        $this->authClientId = "dc2939d2330a4191bb8069c1a2775ea5";
        $this->authClientSecret = "p8e-5FuCNICKqSFyp-aXL5kEjKaQZIBdL3_1";
        $this->adobeCC = new AdobeCreativeCloudCtl($this->authClientId, $this->authClientSecret);
    }

    public function getImagesFromDirectory(GetGalleryImagesRequest $request)
    {
        $requestData = $request->validated();
        $path = public_path($requestData['file_directory']);
        $galleryImages = [];
        $b = File::directories($path);
        /*$galleryImage = array();
        $galleryImage['file_name'] = basename(dirname($path));
        $galleryImage['file_path'] = "";
        $galleryImage['is_file'] = false;
        $galleryImage['is_parent'] = true;
        $galleryImages[] = $galleryImage;*/

        /*foreach ($directories as $directory) {
            $galleryImage = array();
            $galleryImage['file_name'] = basename($directory);
            $galleryImage['file_path'] = "";
            $galleryImage['is_file'] = false;
            $galleryImage['is_parent'] = false;
            $galleryImages[] = $galleryImage;
        }*/
        $files = File::files($path);
        foreach ($files as $file) {
            $galleryImage = array();
            $galleryImage['file_name'] = $file->getFilename();
            $galleryImage['file_path'] = $requestData['file_directory'] . '/' . $file->getFilename();
            $galleryImage['is_file'] = true;
            $galleryImage['is_parent'] = false;
            $galleryImages[] = $galleryImage;
        }
        return response()->json(["status" => true, "message" => "successfully fetched", "result" => $galleryImages], 200);
    }

    public function getAdobeLibraries(GetAdobeLibrariesRequests $request)
    {
        $requestData = $request->validated();
        $data = $this->adobeCC->getLibraries($requestData['access_token']);
        if ($data && isset($data['libraries'])) {
            return response()->json(["status" => true, "message" => "adobe successfully fetched", "result" => $data['libraries']], 200);
        } else {
            return response()->json(["status" => false, "message" => "whoops! unable to find libraries", "result" => null], 500);
        }
    }

    public function getAdobeLibraryElements(GetAdobeImages $request)
    {
        $requestData = $request->validated();
        $library = $this->adobeCC->getLibraryByName($requestData['access_token'], $requestData['library_name']);
        if ($library != null) {
            $data = $this->adobeCC->getLibraryElements($requestData['access_token'], $library['library_urn']);
            if (isset($data) && isset($data['elements'])) {
                return response()->json(["status" => true, "message" => "library elements successfully fetched", "result" => $data['elements']], 200);
            } else {
                return response()->json(["status" => false, "message" => "whoops! unable to find library elements", "result" => null], 500);
            }
        } else {
            return response()->json(["status" => false, "message" => "whoops! unable to find library elements", "result" => null], 500);
        }
    }

    public function getAdobeAccessToken(GetAdobeAccessToken $request)
    {
        $request->validated();
        $token = $this->adobeCC->getAdobeAccessToken($request->validated()['code']);
        return response()->json(["status" => true, "message" => "found adobe access token", "result" => $token], 200);
    }

    public function getAdobeElementImageInBase64(GetAdobeImageBase64 $request)
    {
        $request->validated();
        $tempFilePath = $this->adobeCC->getAdobeElementThumbnail($request->validated()['access_token'], $request->validated()['thumbnail_url']);
        return response()->download($tempFilePath);
    }

    public function uploadFileData(UploadFileRequest $request)
    {
        $request->validated();

        $upload_dir = "files";
        if ($request->has('file_directory')) {
            //
            $upload_dir = $request->file_directory;
        }

        $uploadedFile = $this->uploadFile($request, $upload_dir , 'file');
        return response()->json(["status" => true, "message" => "file uploaded", "result" => $uploadedFile], 200);
    }
}
