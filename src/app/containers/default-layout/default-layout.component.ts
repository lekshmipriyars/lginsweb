import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import { staffNavItems } from './../../_staffnav';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { Router } from '@angular/router';
import { UserData } from '../../views/login/userdata';
import { ConfigFile,APPVERSION } from '../../views/services/configfile';
@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html'
})


export class DefaultLayoutComponent {
    userData = new UserData();
    configFile = new ConfigFile();
    appversion = new APPVERSION();
    displayName = '';
    public navItems = navItems;
    public staffNavItems = staffNavItems;
    public sidebarMinimized = true;
    private changes:MutationObserver;
    public element:HTMLElement = document.body;
    public navItemdatas:Object;
    appversionData = '';

    constructor(public localStorageService:LocalStorageService, private router:Router) {
        console.log('userdata in header -------------:', this.localStorageService.get('userdata'));
        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);
            this.refresh();  /// this needs to be fix..
        } else {
            this.userData = this.localStorageService.get('userdata');
            this.displayName = this.userData.displayName;
            if (this.userData.userType != 4) {
                this.navItemdatas = this.navItems;
            } else {
                this.navItemdatas = this.staffNavItems;
            }

        }


        // it should be changed after user's visit to NestedComponent
        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
        });


        this.changes.observe(<Element>this.element, {
            attributes: true
        });
        this.appversionData = this.appversion.DefaultParams.appVersion;

    }

    refresh():void {
        window.location.reload();
    }

    goLogout() {
        this.localStorageService.clear();
        this.router.navigate(['./home']);
    }
}
