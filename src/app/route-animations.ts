import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
} from '@angular/animations'

export const slider= trigger('routeAnimations',[
    transition("dossier<=>*",slideTo('right')),
    transition("tdb<=>*",slideTo('right')),
    transition("plan<=>*",slideTo('right')),
    transition("prov<=>*",slideTo('right')),
    transition("sm<=>*",slideTo('right')),
    transition("user<=>*",slideTo('right')),
    //transition("formation<=>Login",slideTo('')),
    //transition("formation<=>*",slideTo('right')),
    transition("bpf<=>*",slideTo('right')),
    transition("leads<=>*",slideTo('right')),
    transition("ipbx<=>*",slideTo('right')),
    transition("compteur<=>*",slideTo('right')),
    transition("relance<=>*",slideTo('right')),
    transition("params<=>*",slideTo('right')),
    //transition("login<=>*",slideTo('right')),

])
function slideTo(direction){
    const optional= {optional:true};
    return[
        query(':enter, :leave',[
            style({
                position: 'absolute',
                top:0,
                [direction]:0,
                width: '100%'
            })
        ],optional),
        query(':enter',[
            style({
                [direction]:'-100%'
                }),
            ],optional),
        group([
            query(':leave',[
                animate('600ms ease',style({ [direction]: '100%'}))
            ],optional),
            query(':enter',[
                animate('600ms ease',style({ [direction]: '0%'}))
            ],optional),
        ]),
    ];
}