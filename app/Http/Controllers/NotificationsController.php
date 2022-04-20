<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notifications;
use App\Models\User;

class NotificationsController extends Controller
{

    /**
     * Requesting and generating a list of notifications to the system.
     */
    // public function shortNotification() {
    //     $notifications = new Notifications();
    //     $new = $notifications::where('read', false)->limit(10)->orderBy('id', 'desc')->get();
    //     //$alerts = $notifications::where('read', false)->where('type', 'ALERT')->limit(10)->orderBy('id', 'desc')->get();
    //     $alerts = $new->filter(function($value) {return $value['type'] === 'ALERT';})->all();
    //     $logs = $notifications::where('read', false)->where('type', 'LOG')->limit(10)->orderBy('id', 'desc')->get();
    //     $events = $notifications::where('read', false)->where('type', 'EVENT')->limit(10)->orderBy('id', 'desc')->get();
    //     $send_data = ['NEW' => $new, 'ALERT' => $alerts, 'LOG' => $logs, 'EVENTS'=> $events];
    //     $response = response()->json($send_data, 200);

    //     return $response;
    // }

    /**
     * Requesting and generating a list of notifications to the system.
     *
     * Use collection method filter()
     * 
     * @return \Illuminate\Http\Response
    */
    // public function shortNotification1() {
    //     $notifications = new Notifications();
    //     $new = $notifications::where('read', false)->limit(10)->orderBy('id', 'desc')->get();
    //     $alerts = $new->filter(function($value) {return $value['type'] === 'ALERT';})->all();
    //     $logs = $new->filter(function($value) {return $value['type'] === 'LOG';})->all();
    //     $events = $new->filter(function($value) {return $value['type'] === 'EVENT';})->all();
    //     $send_data = ['NEW' => $new, 'ALERT' => $alerts, 'LOG' => $logs, 'EVENT'=> $events];
    //     $response = response()->json($send_data, 200);
    //     return $response;
    // }
    public function shortNotification() {
        $notifications = new Notifications();
        $new = $notifications::where('read', false)->limit(100)->orderBy('id', 'desc')->get();
        $alerts = $notifications::where('read', false)->where('type', 'ALERT')->limit(10)->orderBy('id', 'desc')->get();
        $logs = $notifications::where('read', false)->where('type', 'LOG')->limit(10)->orderBy('id', 'desc')->get();
        $events = $notifications::where('read', false)->where('type', 'EVENT')->limit(10)->orderBy('id', 'desc')->get();
        $send_data = ['NEW' => $new, 'ALERT' => $alerts, 'LOG' => $logs, 'EVENT'=> $events];
        $response = response()->json($send_data, 200);
        return $response;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
