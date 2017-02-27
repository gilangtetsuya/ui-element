/**
 * Sidenav.js 
 * create definition slide sidenav menu
 */

"use strict";

class SideNav {
    constructor () {
        this.showButtonEl = document.querySelector('.js-show-menu');
        this.sideNavEl = document.querySelector('.js-side-nav');
        this.sideNavContainerEl = document.querySelector('.js-side-nav-container');
        // detabinator set
        this.detabinator = new Detabinator(this.sideNavContainerEl);
        this.detabinator.inert = true;

        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.update = this.update.bind(this);
        this.blockClick = this.blockClick.bind(this);
        this.onTransitionEnd = this.onTransitionEnd.bind(this);

        this.startX = 0;
        this.currentX = 0;
        this.touchingSideNav = false;

        this.handleEvents();
    }

    handleEvents () {
        this.showButtonEl.addEventListener('click', this.showMenu);
        this.sideNavEl.addEventListener('click', this.hideMenu);
        this.sideNavContainerEl.addEventListener('click', this.blockClick);
        // tocuhing event for mobile view       
        this.sideNavEl.addEventListener('touchstart', this.onTouchStart);
        this.sideNavEl.addEventListener('touchmove', this.onTouchMove);
        this.sideNavEl.addEventListener('touchend', this.onTouchEnd);
    }

    onTouchStart (evt) {
        if (!this.sideNavEl.classList.contains('side-nav--visible'))
            return;

         this.startX = evt.touches[0].pageX;
         this.currentX = this.startX;

         this.touchingSideNav = true;
         requestAnimationFrame(this.update);    
    }

    onTouchMove (evt) {
        if (!this.touchingSideNav)  
            return;

        this.currentX = evt.touches[0].pageX;    
    }

    onTouchEnd (evt) {
        if (!this.touchingSideNav)
            return;

        this.touchingSideNav = false;

        const translateX = Math.min(0, this.currentX - this.startX);
        this.sideNavContainerEl.style.transform = '';

        if (translateX < 0) {
            this.hideMenu();
        }    
    }

    update () {
        if (!this.touchingSideNav)  
            return;
         
        requestAnimationFrame(this.update);

        const translateX = Math.min(0, this.currentX - this.startX);
        this.sideNavContainerEl.style.transform = `translateX(${translateX}px)`;    
    }

    blockClick (evt) {
        evt.stopPropagation();
    }

    onTransitionEnd () {
        this.sideNavEl.classList.remove('side-nav--animatable');
        this.sideNavEl.removeEventListener('transitionend', this.onTransitionEnd);
    }

    showMenu () {
        this.sideNavEl.classList.add('side-nav--animatable');
        this.sideNavEl.classList.add('side-nav--visible');
        this.detabinator.inert = false;
        this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }

    hideMenu () {
        this.sideNavEl.classList.add('side-nav--animatable');
        this.sideNavEl.classList.remove('side-nav--visible');
        this.detabinator.inert = true;
        this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }
}

window.addEventListener('load', () => { new SideNav() });
