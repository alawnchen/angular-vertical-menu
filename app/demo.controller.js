angular.module('angularVerticalMenuDemo').controller('angularVerticalMenuDemoCtrl', AngularVerticalMenuDemoCtrl);

AngularVerticalMenuDemoCtrl.$inject = [ '$scope', '$http', '$log' ];

/**
 * 
 * @param $scope
 * @param $http
 * @param $log
 */
function AngularVerticalMenuDemoCtrl($scope, $http, $log) {
    var vm = this;

    var menu = [ {
	icon : 'fa-file-o',
	label : 'File',
	children : [ {
	    label : 'Save',
	    icon : 'fa-floppy-o',
	    href : '/route/save'
	}, {
	    label : 'Save as...',
	    icon : 'fa-floppy-o',
	    callback : function(item) {
		vm.callbackFn(item);
	    }
	}, {
	    label : 'Refresh',
	    icon : 'fa-refresh'
	} ]
    }, {
	icon : 'fa-plane',
	label : 'Edit',
	children : [ {
	    label : 'Cut',
	    icon : 'fa-cut'
	}, {
	    label : 'Copy',
	    icon : 'fa-files-o'
	}, {
	    label : 'Paste',
	    icon : 'fa-clipboard'
	} ]
    } ];

    vm.menu = null;

    vm.msg = null;

    vm.config = {
	data : angular.copy(menu)
    };

    vm.defaultBulletIconCfg = null;
    vm.customBulletIconCfg = null;
    vm.animationCfg = {
	    animation :true,
	    data : angular.copy(menu)
    };
    vm.customAnimationCfg = {
	    animation : {
		duration : 1.2,
		timing : 'linear'
	    },
	    data : angular.copy(menu)
    }
    vm.badgeCfg = {
	    data : [{ 
		"label" : "Mailbox",
		"icon" : "fa-envelope",
		"badge" : "16"
	}]
    };
    vm.badgeCfg2 = {
	    data : [{ 
		"label" : "Mailbox",
		"icon" : "fa-envelope",
		"badge" : {
		    "context" : "badge-success",
		    "value"   : "8"	
		}
	}]
    };

    vm.callbackFn = function(item) {
	vm.msg = 'You clicked on item : ' + angular.toJson(item);
    };

    vm.init = function() {
	$http.get('app/menu.json').success(function(data, status, headers, config) {
	    vm.menu = angular.fromJson(data);
	}).error(function(data, status, headers, config) {
	    $log.error(data);
	});
	vm.defaultBulletIconCfg = {
	    data : removeIcons(angular.copy(menu))
	};
	vm.customBulletIconCfg = {
		default : {
		    icon : 'fa-plus'
		},
	    data : removeIcons(angular.copy(menu))
	};
    };

    function removeIcons(menu) {
	angular.forEach(menu, function(item) {
	    angular.forEach(item.children, function(child) {
		delete child.icon;
	    });
	});
	return menu;
    }

}