<?php

namespace App\Helpers;

use Mail;
use App\Models\SystemSettings;

class Mailer {

    /**
     * Mail sender
     *
     * @param string $html
     * @param array $data
     *
     */
    public static function send_mail($html, $data) {
        $SystemSettings = SystemSettings::first();
        if(!$data['sender_mail'] && !$data['sender_name']) {
            $sender_mail = $SystemSettings->system_email;
            $sender_name = $SystemSettings->system_owner;
        } else {
            $sender_mail = $data['sender_mail'];
            $sender_name = $data['sender_name'];
        }
        Mail::send(array(), array('data' => $data), function ($message) use ($data, $html, $sender_mail, $sender_name) {
            $message->from($sender_mail, $sender_name);
            $message->sender($sender_mail, $sender_name);
            $message->to($data['email'], $data['name']);
            $message->replyTo($data['replyto_email'], $data['replyto_name']);
            $message->subject($data['subject']);
            $message->priority(3);
            $message->setBody($html,'text/html');
        });
    }
}
