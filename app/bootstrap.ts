import {bootstrap} from 'angular2/platform/browser';
import {Component, provide} from 'angular2/core';
import {HTTP_PROVIDERS} from "angular2/http";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, HashLocationStrategy, LocationStrategy} from "angular2/router";
import {HomeComponent} from './components/home/home.component';

@Component({
	selector: 'my-app',
	template: `<router-outlet></router-outlet>`,
	directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{ path: '/', component: HomeComponent, as: 'Home' }
])
export class AppComponent {

}

bootstrap(AppComponent, [HTTP_PROVIDERS, ROUTER_PROVIDERS,
    provide(LocationStrategy,  {useClass: HashLocationStrategy})])
    .catch(error =>console.error(error));
