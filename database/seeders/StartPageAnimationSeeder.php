<?php

namespace Database\Seeders;

use App\Models\StartPageAnimation;
use Illuminate\Database\Seeder;

class StartPageAnimationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        StartPageAnimation::create([
            'name' => 'Cirecles with squad',
            'color1' => '#2980b9',
            'color1_used' => true,
            'color2' => '#2980b9',
            'color2_used' => true,
            'color3' => '#2980b9',
            'color3_used' => true,
            'css' => '
            .loading-text {
                position: absolute;
                top: 60%;
                width:100%;
                color:{{color3}};
                text-align:center;
                font-size:17px;
              }
              .loading {
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120px;
                animation-name: beesandbombs;
                animation-duration: 4s;
                animation-iteration-count: infinite;
                animation-timing-function: cubic-bezier(0.82, 0.01, 0.15, 1.01);
              }
              .loading .circle {
                position: relative;
                background: {{color1}};
                width: 50px;
                height: 50px;
                border-radius: 100%;
                margin: 5px;
                float: right;
                animation-name: beesandbombscircle;
                animation-duration: 4s;
                animation-iteration-count: infinite;
                animation-timing-function: cubic-bezier(0.82, 0.01, 0.15, 1.01);
              }
              .loading .circle:before {
                content: "";
                position: absolute;
                background: {{color2}};
                width: 25px;
                height: 25px;
                animation-name: beesandbombscirclebox;
                animation-duration: 4s;
                animation-iteration-count: infinite;
                animation-timing-function: cubic-bezier(0.82, 0.01, 0.15, 1.01);
              }
              .loading .circle:nth-child(1)::before {
                left: 0;
                bottom: 0;
                border-bottom-left-radius: 40px;
              }
              .loading .circle:nth-child(2)::before {
                right: 0;
                bottom: 0;
                border-bottom-right-radius: 40px;
              }
              .loading .circle:nth-child(3)::before {
                top: 0;
                left: 0;
                border-top-left-radius: 40px;
              }
              .loading .circle:nth-child(4)::before {
                top: 0;
                right: 0;
                border-top-right-radius: 40px;
              }
              .loading:before {
                content: "";
                position: absolute;
                width: 60px;
                height: 60px;

                background: {{color2}};
                top: 50%;
                left: 50%;
                z-index: 1;
                transform: translate(-50%, -50%);
                animation-name: beesandbombsrev;
                animation-duration: 4s;
                animation-iteration-count: infinite;
                animation-timing-function: cubic-bezier(0.82, 0.01, 0.15, 1.01);
              }
              @keyframes beesandbombs {
                0% {
                  transform: translate(-50%, -50%) rotate(0deg);
                }
                50% {
                  transform: translate(-50%, -50%) rotate(90deg);
                }
                100% {
                  transform: translate(-50%, -50%) rotate(0deg);
                }
              }
              @keyframes beesandbombsrev {
                0% {
                  transform: translate(-50%, -50%) rotate(0deg);
                }
                50% {
                  transform: translate(-50%, -50%) rotate(90deg);
                }
                52% {
                  visibility: hidden;
                }
                100% {
                  transform: translate(-50%, -50%) rotate(0deg);
                  visibility: hidden;
                }
              }
              @keyframes beesandbombscircle {
                0% {
                  transform: rotate(0deg);
                }
                50% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(-360deg);
                }
              }
              @keyframes beesandbombscirclebox {
                0% {
                  visibility: hidden;
                }
                50% {
                  visibility: hidden;
                }
                51% {
                  visibility: visible;
                }
                100% {
                  visibility: visible;
                }
              }
            ',
            'html'=> '
                <div class="loading">
                <div class="circle"></div>
                <div class="circle"></div>
                <div class="circle"></div>
                <div class="circle"></div>
            </div>
            <div class="loading-text">{{"START_LOADING_TEXT" | translate}}</div>            
            '
        ]);


        StartPageAnimation::create([
            'name' => 'Big squades',
            'color1' => '#2980b9',
            'color1_used' => true,
            'color2' => '#2980b9',
            'color2_used' => true,
            'css' => '
              .example {
                position: fixed;
                top: 50%;
                left: 50%;
                height: 10px;
                width: 10px;
                transform: translateX(-50%) translateY(-50%);
              }
              .container {
                position: absolute;
                top: 0;
                left: 0;
                height: 10px;
                width: 10px;
              }
              .block {
                position: absolute;
                top: 0;
                left: 0;
                height: 10px;
                width: 10px;
              }
              .block > .item {
                position: absolute;
                height: 10px;
                width: 10px;
                background: {{color1}};
                -webkit-animation: move 0.5s linear infinite;
                        animation: move 0.5s linear infinite;
              }
              .block > .item:nth-of-type(1) {
                top: -10px;
                left: -10px;
                -webkit-animation-delay: 0s;
                        animation-delay: 0s;
              }
              .block > .item:nth-of-type(2) {
                top: -210px0px;
                left: 0;
                -webkit-animation-delay: -0.0625s;
                        animation-delay: -0.0625s;
              }
              .block > .item:nth-of-type(3) {
                top: -10px;
                left: 10px;
                -webkit-animation-delay: -0.125s;
                        animation-delay: -0.125s;
              }
              .block > .item:nth-of-type(4) {
                top: 0;
                left: 10px;
                -webkit-animation-delay: -0.1875s;
                        animation-delay: -0.1875s;
              }
              .block > .item:nth-of-type(5) {
                top: 10px;
                left: 10px;
                -webkit-animation-delay: -0.25s;
                        animation-delay: -0.25s;
              }
              .block > .item:nth-of-type(6) {
                top: 10px;
                left: 0;
                -webkit-animation-delay: -0.3125s;
                        animation-delay: -0.3125s;
              }
              .block > .item:nth-of-type(7) {
                top: 10px;
                left: -10px;
                -webkit-animation-delay: -0.375s;
                        animation-delay: -0.375s;
              }
              .block > .item:nth-of-type(8) {
                top: 0;
                left: -10px;
                -webkit-animation-delay: -0.4375s;
                        animation-delay: -0.4375s;
              }
              @-webkit-keyframes move {
                0% {
                  opacity: 0;
                }
                10% {
                  opacity: 1;
                }
                70% {
                  opacity: 0;
                }
                100% {
                  opacity: 0;
                }
              }
              @keyframes move {
                0% {
                  opacity: 0;
                }
                10% {
                  opacity: 1;
                }
                70% {
                  opacity: 0;
                }
                100% {
                  opacity: 0;
                }
              }
              div.loading-text {
                position: fixed;
                top: 55%;
                left: 0px;
                width: 100%;
                text-align:center;
                color:{{color2}};
              }
            ',
            'html'=> "
            <div class='example'>
            <div class='block'>
                <div class='item'></div>
                <div class='item'></div>
                <div class='item'></div>
                <div class='item'></div>
                <div class='item'></div>
                <div class='item'></div>
                <div class='item'></div>
                <div class='item'></div>
            </div>
            
        </div>
            <div class='loading-text'>{{'START_LOADING_TEXT' | translate}}</div>            
            "
        ]);




        StartPageAnimation::create([
          'name' => 'Circle bubble',
          'color1' => '#fff000',
          'color1_used' => true,
          'color2' => '#fff000',
          'color2_used' => true,
          'color3' => '#fff000',
          'color3_used' => false,
          'css' => '
          .nwicode.ring
          {
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            width:150px;
            height:150px;
            background:transparent;
            
            border-radius:50%;
            text-align:center;
            line-height:150px;
            font-family:sans-serif;
            font-size:13px;
            color: {{color2}};
            letter-spacing:4px;
            text-transform:uppercase;
            text-shadow:0 0 10px {{color2}};
           
          }
          .nwicode.ring:before
          {
            content:"";
            position:absolute;
            top:-3px;
            left:-3px;
            width:100%;
            height:100%;
            border:3px solid transparent;
            border-top:3px solid {{color1}};
            border-right:3px solid {{color1}};
            border-radius:50%;
            animation:animateC 2s linear infinite;
          }
          .nwicode span.rring
          {
            display:block;
            position:absolute;
            top:calc(50% - 2px);
            left:50%;
            width:50%;
            height:4px;
            background:transparent;
            transform-origin:left;
            animation:animate 2s linear infinite;
          }
          .nwicode span.rring:before
          {
            content:"";
            position:absolute;
            width:16px;
            height:16px;
            border-radius:50%;
            background:{{color1}};
            top:-6px;
            right:-8px;
            box-shadow:0 0 20px {{color1}};
          }
          @keyframes animateC
          {
            0%
            {
              transform:rotate(0deg);
            }
            100%
            {
              transform:rotate(360deg);
            }
          }
          @keyframes animate
          {
            0%
            {
              transform:rotate(45deg);
            }
            100%
            {
              transform:rotate(405deg);
            }
          }
          ',
          'html'=> "
          <div class='nwicode ring'>{{'START_LOADING_TEXT' | translate}}
            <span class='rring'></span>
          </div>
          "
      ]);


      StartPageAnimation::create([
        'name' => 'Circle 1',
        'color1' => '#FFFFFF',
        'color1_used' => true,
        'color2' => '#FF3D00',
        'color2_used' => true,
        'color3' => '#FFFFFF',
        'color3_used' => true,
        'css' => '
        .wrapper {
          text-align:center;
          width:100%;
          height:100%;
        } 
        .loading-text {
          position: absolute;
          top: 60%;
          width:100%;
          color:{{color3}};
          text-align:center;
          font-size:17px;
        }
        .loader-nwicode {
          width: 48px;
          height: 48px;
          top: 45%;
          border: 5px solid {{color1}};
          border-bottom-color: {{color2}};
          border-radius: 50%;
          display: inline-block;
          left: calc(50% - 24px);
          position: absolute;
          -webkit-animation: rotation 1s linear infinite;
                  animation: rotation 1s linear infinite;
        }      
        
        @-webkit-keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }        
        ',
        'html'=> "
        <div class='wrapper'>
        <span class='loader-nwicode'></span>
        <div class='loading-text'>{{'START_LOADING_TEXT' | translate}}</div>    </div>    
        "
    ]);

      StartPageAnimation::create([
        'name' => 'Circle 2',
        'color1' => '#FFFFFF',
        'color1_used' => true,
        'color2' => '#FF3D00',
        'color2_used' => true,
        'color3' => '#FFFFFF',
        'color3_used' => true,
        'css' => '
        .wrapper {
          text-align:center;
          width:100%;
          height:100%;
        }        
        .loading-text {
          position: absolute;
          top: 60%;
          width:100%;
          color:{{color3}};
          text-align:center;
          font-size:17px;
        }
        .loader-nwicode {
          top: 40%;
          width: 48px;
          height: 48px;
          border: 3px solid {{color1}};
          border-radius: 50%;
          display: inline-block;
          position: relative;
          -webkit-animation: rotation 1s linear infinite;
                  animation: rotation 1s linear infinite;
        }
        .loader-nwicode:after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-bottom-color: {{color2}};
        }        
        
        @-webkit-keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }        
        ',
        'html'=> "
        <div class='wrapper'>
        <span class='loader-nwicode'></span>
        <div class='loading-text'>{{'START_LOADING_TEXT' | translate}}</div>    
        </div>
        "
    ]);


        
    }
}
