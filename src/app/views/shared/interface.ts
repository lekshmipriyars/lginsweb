/**
 * Created by priya on 06/07/18.
 */
import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';


export interface IUserLogin {
    inscode:string,
    email: string;
    password: string;
}

export interface IApiResponse {
    status: boolean;
    error?: string;
}
