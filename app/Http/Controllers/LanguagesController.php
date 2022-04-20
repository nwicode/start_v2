<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Helpers\Helper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Models\Languages;
use App\Models\TrPhrases;
use Validator;
use ZipArchive;


class LanguagesController extends Controller {


    /**
     * Change default language
     */
    public function setDefaultLanguage(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'code' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {

                $lang = Languages::where('code', $request->code)->first();
                if ($lang) {
                    Languages::query()->update(array("is_default"=>0));
                    $lang = Languages::where('code', $request->code)->first();
                    $lang->update(array("is_default"=>1));

                    $this->buildtranslations(); //rebuld translations
                    $response = response()->json(['message' => 'DATA_UPDATED']);
                } else {
                    $response = response()->json(['error' => 'DATA_NOT_UPDATED'], 406);
                }

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }


        }
        return $response;
    }


    /**
     * Add new languae to system
     */
    public function AddNewLanguage(Request $request) {

        $user = auth()->user();
        if ($user['user_type_id'] !== 1) {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            return $response;
        }

        $validator = Validator::make(
            $request->all(),
            array(
                'code' => 'required',
                'name' => 'required',
                'flag' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            //check, if lang not exist in db
            $lang = Languages::where('code', $request->code)->first();
            $language_default = Languages::where('is_default', 1)->first();
            if (!$lang) {
                $language_data = array('name' => strtoupper($request->name), 'code' => $request->code, "file"=>"", "image"=>"", 'is_default'=>0);
                $created_language = Languages::create($language_data);

                //copy images to folder
                if(file_exists(public_path('assets/languages/'.$request->code.'.png'))){
                    unlink(public_path('assets/languages/'.$request->code.'.png'));
                }
                $filename= $request->code . ".png";
                $output_file = 'assets/languages/'.$filename;
                $ifp = fopen( $output_file, 'wb' );
                $data = explode( ',', $request->flag );
                fwrite( $ifp, base64_decode($data[1] ) );
                fclose( $ifp );

                //Add language name translation to file
                $languages = new Languages;
                foreach ($languages->all() as $r) {
                    $language_data = array (
                        "lang_id" => $r['id'],
                        "section" => "GENERAL.LANGUAGES",
                        "phrase" =>$request->code,
                        "translation" =>strtoupper($request->name),
                    );
                    TrPhrases::create($language_data);

                    // add default languages
                    $default_phrases = TrPhrases::where("lang_id",$language_default->id)->get();
                    foreach ($default_phrases as $d) {
                        //print_r($d);
                        $item = [
                            "lang_id" => $created_language->id,
                            "section" => $d->section,
                            "phrase" =>$d->phrase,
                            "translation" =>$d->translation,                            
                        ];
                        //print_r($item);
                        //DB::insert("insert into tr_phrases (lang_id, phrase, translation, section) values(?,?,?,?)",[$r["id"], $phrase_code, $phrase_translation, $section]);
                        TrPhrases::create($item);
                    }

                }

                $this->buildtranslations(); //rebuld translations
                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'LANGUAGE_EXISTS'], 406);
            }

        }

        return $response;
    }


    static function saveTranslations() {
        $controller = new LanguagesController();
        $controller->buildtranslations();
    }

    /**
     * Build langauge translations file
     */
    public function buildtranslations() {
        $languages = new Languages;
        $languages_default = Languages::where('is_default', 1)->first();



        $new_lang = new TrPhrases;

        $language_settings_data = [
            "default"=>$languages_default->code,
            "languages"=>[]
        ];
        foreach ($languages->all() as $r) {

            $laguage_item = [
                "id"=>$r['id'],
                "code"=>$r['code'],
                "name"=>$r['name'],
                "file"=>$r['file'],
                "image"=>"assets/languages/".$r['code'].".png",
                "is_default"=>$r['is_default']
            ];
            $language_settings_data['languages'][]=$laguage_item;
        }
        //print_r($language_settings_data);
        file_put_contents(public_path()."/assets/languages/languages.ts","/**
* language settings file
* (this file automaticly generated from backed in production mode)
*/
export const laguageSettings = " . json_encode($language_settings_data));

        //also create json file
        file_put_contents(public_path()."/assets/languages/languages.json",json_encode($language_settings_data,JSON_UNESCAPED_UNICODE+JSON_PRETTY_PRINT));

        //Add nonexisting code to table
        foreach ($languages->all() as $r) {
            $current_lang_path = public_path()."/assets/languages/dist/json/".$r['code'].".json";
            if (file_exists($current_lang_path)) {
                $json_current_langs = json_decode(file_get_contents($current_lang_path), true);
                foreach($json_current_langs as $section=>$phrases) {

                    foreach($phrases as $phrase_code=>$phrase_translation) {
                        $check_exist = TrPhrases::where([
                            ["lang_id",'=',$r["id"]],
                            ["section",'=',$section],
                            ["phrase",'=',$phrase_code],
                        ])->first();
                        if(!$check_exist) DB::insert("insert into tr_phrases (lang_id, phrase, translation, section) values(?,?,?,?)",[$r["id"], $phrase_code, $phrase_translation, $section]);

                    }


                }

            }
        }


        foreach ($languages->all() as $lang) {
            $current_langs = TrPhrases::where('lang_id', $lang['id'])->get();

            //get unique sections
            $sections = [];
            foreach ($current_langs as $current_lang) {
                $r = json_decode($current_lang,true);
                $sections[$r['section']]=[];
            }

            $data = [];
            foreach ($current_langs as $current_lang) {
                $r = json_decode($current_lang,true);
                $sections[$r['section']] [$r['phrase']]=$r['translation'];
            }
            $data = $sections;
            file_put_contents(public_path()."/assets/languages/json/".$lang["code"].".json",json_encode($data,JSON_FORCE_OBJECT+JSON_UNESCAPED_UNICODE+JSON_PRETTY_PRINT));


        }

        return response()->json(['success' => true]);
    }

    /**
     * Return translation list to front
     */
    public function getTranslations (Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {

                //First, get default lang
                $language_default = Languages::where('is_default', 1)->first();
                $default_translations = TrPhrases::where('lang_id', $language_default->id)->get();
                $default_translation = [];
                foreach ($default_translations as $t) {
                    $default_translation[$t['section'] . "." . $t['phrase']] = $t['translation'];
                }


                //create lang array
                $result = [];
                $langs = TrPhrases::where('lang_id', $request->id)->get();
                foreach ($langs as $lang) {
                    $lang["was_changed"]=false;
                    if (isset($default_translation[$lang['section'] . "." . $lang['phrase']])) $lang["default"]=$default_translation[$lang['section'] . "." . $lang['phrase']];
                    else $lang["default"]="";
                    $result[]=$lang;
                }
                $response = response()->json(["translations"=>$result,]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }


        }
        return $response;
    }


    public function updateTranslations(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'translations' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {

                foreach($request->translations as $t) {
                    $updating = DB::table('tr_phrases')
                    ->where('id',$t['id'])
                    ->update(['translation'=>$t['translation']]);

                }

                $this->buildtranslations();
                $response = response()->json(['message' => 'DATA_UPDATED']);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }


        }
        return $response;
    }

    /**
     * Add new language pack
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|mixed|string
     */
    public function downloadLanguagePack(Request $request) {
        $user = auth()->user();
        if ($user['user_type_id'] !== 1) {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            return $response;
        }

        $validator = Validator::make(
            $request->all(),
            array(
                'zip' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $zip = new ZipArchive;
            $isOpen = $zip->open($request->zip);
            if ($isOpen === TRUE) {
                $extractPath = sys_get_temp_dir();
                $zip->extractTo($extractPath, 'package.json');

                if (file_exists($extractPath.'/package.json')) {
                    $packageJson = json_decode(file_get_contents($extractPath.'/package.json'));
                    $code = $packageJson->code;
                    $name = $packageJson->name;

                    unlink($extractPath.'/package.json');
                    $zip->extractTo($extractPath, [$code.'.json', $code.'.png']);

					//try to open file
					if (file_exists($extractPath.'/'.$code.'.json')) {
						$check_content = file_get_contents($extractPath.'/'.$code.'.json');
						$result = @json_decode($check_content);
						if ($result === null && json_last_error() !== JSON_ERROR_NONE) {
							$response = response()->json(['error' => 'WRON_JSON_FORMAT', 'message'=>"Language JSON in BAD format (check him before uploading in JSON ONLINE validator."], 406);
							return $response;							
						}
					}

                    if (file_exists($extractPath.'/'.$code.'.json') && file_exists($extractPath.'/'.$code.'.png')) {
                        if(file_exists(public_path().'/assets/languages/dist/json/'.$code.'.json')) {
                            unlink(public_path().'/assets/languages/dist/json/'.$code.'.json');
                        }
                        if(file_exists(public_path().'/assets/languages/'.$code.'.png')) {
                            unlink(public_path().'/assets/languages/'.$code.'.png');
                        }

                        rename($extractPath.'/'.$code.'.json', public_path().'/assets/languages/dist/json/'.$code.'.json');
                        rename($extractPath.'/'.$code.'.png', public_path().'/assets/languages/'.$code.'.png');

                        DB::table('languages')->upsert([
                            'code'=> $code,
                            'name'=> $name,
                            'file'=> '/assets/languages/dist/json/'.$code.'.json',
                            'image'=> '/assets/languages/'.$code.'.png',
                            'is_default'=> 0
                        ], ['code'], ['name', 'file', 'image']);

                        $query = DB::table('languages')->select('id', 'name')->get();
                        for($i = 0; $i < $query->count(); $i++) {

                            
                            DB::table('tr_phrases')->updateOrInsert([
                                'lang_id'=> $query[$i]->id,
                                'phrase'=> $code,
                            ], [
                                'translation'=> $name,
                                'section'=> 'GENERAL.LANGUAGES'
                            ]);
                        }

                        $this->buildtranslations();
                        $response = response()->json(['message' => 'DATA_UPDATED']);
                    } else {
                        $response = response()->json(['error' => 'REQUIRED_FILES_NOT_FOUND', 'message'=>"Some files missed in archive"], 406);
                    }
                } else {
                    $response = response()->json(['error' => 'PACKAGE.JSON_NOT_FOUND', 'message'=>"File package.json not found 406"]);
                }

                $zip->close();
            } else {
                $response = response()->json(['error' => 'CORRUPTED_ARCHIVE'], 406);
            }
        }

        return $response;
    }

    /**
     * Delete language
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|mixed|string
     */
    public function DeleteLanguage(Request $request) {
        $user = auth()->user();
        if ($user['user_type_id'] !== 1) {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            return $response;
        }

        $validator = Validator::make(
            $request->all(),
            array(
                'code' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            //remove language file ()
            File::delete(public_path("assets/languages/json/".$request->code.".json"));
            File::delete(public_path("assets/languages/dist/json/".$request->code.".json"));
            File::delete(public_path("assets/languages/".$request->code.".png"));

            $selected_lang = Languages::where('code', $request->code)->first();
            $language_default = Languages::where('is_default', 1)->first();

            //remove language from databse
            Languages::where('code', $request->code)->delete();

            //switch users with this languages to default
            DB::table('users')->where('default_language', $selected_lang->code)->update(['default_language'=>$language_default->code]);

            //remove translation
            DB::table('tr_phrases')->where('lang_id', $selected_lang->id)->delete();

            $this->buildtranslations(); //rebuld translations
            $response = response()->json(['message' => 'DATA_UPDATED']);

        }
        return $response;
    }
    
}
