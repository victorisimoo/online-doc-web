# ngSecurity #

[![Build status][build-status-image]][build-status-url] [![Watch dependencies][dependencies-image]][dependencies-url] [![Watch dev dependencies][devDependencies-image]][devDependencies-url] [![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url]

#### A security module for [AngularJS](http://angularjs.org). ####

## Install ##
Installing via [Bower](http://bower.io/):  
```shell
$ bower install ngsecurity
```

Installing via [NPM](https://www.npmjs.org/):  
```shell
$ npm install ngsecurity
```

## Get Started ##
Your setup should look similar to the following:
```javascript
/* file: app.js */
angular
  .module('myApp', ['ngSecurity'])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('$securityInterceptor');
  }])
  .run(function ($rootScope) {
    $rootScope.$on('unauthenticated', function () {
      alert('redirect to login');
    });
    $rootScope.$on('permissionDenied', function () {
      alert('redirect to permission denied');
    });
  });
```

```html
<!-- file: index.html -->
<!DOCTYPE html>
<html ng-app="myApp">
  <body>
    <form ng-submit-login="/auth/login">
      <input type="text" name="username" />
      <input type="password" name="password" />
      <button type="submit">Login</button>
    </form>
    <div ng-if-authenticated>
      User is authenticated
    </div>
    <div ng-if-anonymous>
      User is Anonymous
    </div>
    <div ng-if-permission="admin">
      User is Administrator
    </div>

    <script src="app.js"></script>
  </body>
</html>
```

```javascript
/* POST /api/auth response */
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",  /* required */
  "user": {  /* optional */
    "name": 'Administrator'
  },
  "permissions": [  /* optional */
    'admin'
  ]
}
```


## API ##

### Service Methods ###
#### login(token: String, [user: Object, [permissions: Array]])  [Simple strategy] ####
Authenticate a user with token. Data and permissions are optional.  
Simple example:  

```javascript
angular
  .module('myApp')
  .controller(['$scope', '$http', '$security', function ($scope, $http, $security) {
    $scope.username = 'admin';
    $scope.password = 'admin';
    $scope.authenticate = function () {
      $http.post('/api/auth', {
        username: $scope.username,
        password: $scope.password
      }).success(function (data) {
        $security.login(data.token, data.user, data.permissions);
      });
    }
  }]);
```

#### login(token: String, [permissions: Array])  [JWT strategy] ####
Authenticate a user with token. Permissions are optional.  
[JWT](http://jwt.io/) example:  

```javascript
/* file: app.js */
angular
  .module('myApp')
  .config(['$httpProvider', '$securityConfigProvider', function ($httpProvider, $securityConfigProvider) {
    $httpProvider.interceptors.push('$securityInterceptor');
    $securityConfigProvider.configure({
      strategy: 'jwt',
    });
  }])
  .controller(['$scope', '$http', '$security', function ($scope, $http, $security) {
    $scope.username = 'admin';
    $scope.password = 'admin';
    $scope.authenticate = function () {
      $http.post('/api/auth', {
        username: $scope.username,
        password: $scope.password
      }).success(function (data) {
        $security.login(data.token, data.permissions);
      });
    }
  }]);
```  
#### loginByUrl(url: String, data: Object) ####
Use resource for authenticate user. The service should return a response compatible. The return is a promise.  
Simple example:  

```javascript
angular
  .module('myApp')
  .controller(['$scope', '$security', function ($scope, $security) {
    $scope.username = 'admin';
    $scope.password = 'admin';
    $scope.authenticate = function () {
      $security.loginByUrl('/api/auth', {
        username: $scope.username,
        password: $scope.password
      }));
    }
  }]);
```

Compatible API response:  

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",  /* required */
  "user": {  /* optional */
    "name": 'Administrator'
  },
  "permissions": [  /* optional */
    'admin'
  ]
}
```

[JWT](http://jwt.io/) example:  

```javascript
/* file: app.js */
angular
  .module('myApp')
  .config(['$httpProvider', '$securityConfigProvider', function ($httpProvider, $securityConfigProvider) {
    $httpProvider.interceptors.push('$securityInterceptor');
    $securityConfigProvider.configure({
      strategy: 'jwt',
    });
  }])
  .controller(['$scope', '$security', function ($scope, $security) {
    $scope.username = 'admin';
    $scope.password = 'admin';
    $scope.authenticate = function () {
      $security.loginByUrl('/api/auth', {
        username: $scope.username,
        password: $scope.password
      }));
    };
  }]);
```  

Compatible API response:  

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW5pc3RyYXRvciJ9.cwtcdrm6c5fXBdnhzkFnlXmvvsRY7xB6YsKrLE_phm4",  /* required */
}
```

#### logout() ####
User logout and remove session user data.  

#### hasPermission(permission: String) ####
Check if user has permission.  

#### hasAllPermission(permissions: Array) ####
Check if user has all permission of array.  

#### hasAnyPermission(permissions: Array) ####
Check if user has any permission of array.  

#### isAuthenticated() ####
Check if user is authenticated.  

#### getUser() ####
Get session user data.  

#### getPermissions() ####
Get session user permissions.  

### Directives ###

#### ng-if-authenticated (Attribute only)  ####
The directive only shows the HTML element if user is authenticated.

#### ng-if-anonymous (Attribute only)  ####
The directive only shows the HTML element if user not is authenticated.

#### ng-if-permission="\<permission: String\>" (Attribute only)  ####
The directive only shows the HTML element if user has permission.  

```html
<div ng-if-permission="admin,staff">
  <p>Admin or Staff</p>
  <div ng-if-permission="admin">
    <p>Admin</p>
  </div>
</div>
```

#### ng-if-permission-model="\<permission: Any\>" (Attribute only)  ####
The directive only shows the HTML element if user has permission specified on scope.  

```javascript
angular
  .module('myApp')
  .controller(['$scope', '$security', function ($scope, $security) {
    $scope.allPermission = [
      'admin',
      'staff'
    ];
    $scope.adminPermission = 'admin';
  }]);
```
```html
<div ng-if-permission-model="allPermission">
  <p>Admin or Staff</p>
  <div ng-if-permission-model="adminPermission">
    Admin
  </div>
</div>
```

#### ng-permission-type="ALL|ANY" (Attribute only)  ####
The auxiliary directive for *ng-if-permission*, *ng-if-permission-model* and *ng-enabled-permission*, it determine the validation method.  
The value default is *ANY*.
```html
<div ng-if-permission="admin,staff" ng-permission-type="ANY">
  <p>Admin or Staff</p>
</div>
<div ng-if-permission="admin,staff" ng-permission-type="ALL">
  <p>Admin and Staff</p>
</div>
```

#### ng-enabled-permission="\<permission: String\>" (Attribute only)  ####
The directive sets the disabled attribute on the HTML element if user has permission.  

```html
<button ng-enabled-permission="admin,staff">
  Add User
</button>
<button ng-enabled-permission="admin">
  Remove User
</button>
```

#### ng-click-logout (Attribute only)  ####
The directive logout current user.  

```html
<button ng-click-logout>
  Logout
</button>
```

#### ng-bind-user="\<attribute: String\>" (Attribute only)  ####
The directive replace the text content of the specified HTML element with the user data.  

```html
<div ng-bind-user="name">
  <!-- render user name -->
</div>
```

#### ng-submit-login="\<url: String\>" (Attribute only)  ####
The directive login user when submit form. It calls back *ng-login-success* when success to login, and calls back *ng-login-error* when fail to login.  

```html
<form ng-submit-login="/api/auth" ng-login-success="success($response)" ng-login-error="error($response)">
  <div ng-show-login-success> <!-- show the HTML element when login is successful -->
    <p>Success!</p>
  </div>
  <div ng-show-login-error> <!-- show the HTML element when login failed -->
    <p>Username or password invalid!</p>
  </div>
  <input type="text" name="username" />
  <input type="password" name="password" />
  <button type="submit">Login</button>
</form>
```

### Provider Options ###
```javascript
angular
  .module('myApp')
  .config(['$securityConfigProvider', function ($securityConfigProvider) {
    $securityConfigProvider.configure({
      strategy: 'simple',  /* Validation method. Examples: 'jwt' */
      token: {
        header: 'Authorization',  /* request header name intercepted */
        prefix: ''
      },
      storageName: {
        token: 'ng-security-authorization',
        user: 'ng-security-user',
        permissions: 'ng-security-permissions'
      },
      responseErrorName: {  /* the name for broadcast of request error intercepted */
        401: 'unauthenticated',
        403: 'permissionDenied'
      }
    });
  }]);
```

[build-status-image]: https://travis-ci.org/concretesolutions/ng-security.svg
[build-status-url]: https://travis-ci.org/concretesolutions/ng-security

[dependencies-image]: https://david-dm.org/concretesolutions/ng-security.svg
[dependencies-url]: https://david-dm.org/concretesolutions/ng-security

[devDependencies-image]: https://david-dm.org/concretesolutions/ng-security/dev-status.svg
[devDependencies-url]: https://david-dm.org/concretesolutions/ng-security#info=devDependencies

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/ngsecurity
[npm-version-image]: http://img.shields.io/npm/v/ngsecurity.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/ngsecurity.svg?style=flat
