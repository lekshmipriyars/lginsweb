/**
 * Created by priya on 26/08/18.
 */
import { Component, HostListener } from "@angular/core";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";

@Component({

    selector: 'app-online-offline',
    templateUrl: './online-offline.component.html',
    styleUrls: ['./online-offline.component.css']
})
export class OnlineOfflineComponent {
    public isOnline:boolean;
    public showConnectionStatus:boolean;
    private showConnectionStatusSub:Subscription;
    private showConnectionStatusTimer:Observable<any>;
    timer:any;

    constructor() {
     ///   this.showConnectionStatusTimer = Observable.timer(5000);
    }

    @HostListener('window:offline', ['$event']) onOffline() {
        this.isOnline = false;
        this.showConnectionStatus = true;
        if (this.showConnectionStatusSub) {
            this.showConnectionStatusSub.unsubscribe();
        }
    }

    @HostListener('window:online', ['$event']) onOnline() {
        this.isOnline = true;
        this.showConnectionStatus = true;
        this.showConnectionStatusSub = this.showConnectionStatusTimer.subscribe(() => {
            this.showConnectionStatus = false;
            this.showConnectionStatusSub.unsubscribe();
            window.location.reload();
        });
    }

    ngOnDestroy():void {
        if (this.showConnectionStatusSub) {
            this.showConnectionStatusSub.unsubscribe();
        }
    }
}