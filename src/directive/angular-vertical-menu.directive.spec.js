'use strict';

/* jshint -W117, -W030 */
describe('angular-vertical-directive::controller', function() {

    var rootScope;

    beforeEach(module('angularVerticalMenu'));

    afterEach(function() {
	if (rootScope) {
	    rootScope.$destroy();
	}
    });

    it('should return default bullet icon', function() {
	var ctrl = new VerticalMenuController();
	ctrl.config = {};
	expect(ctrl.getDefaultIcon()).to.eql(ctrl.DEFAULT_BULLET_ICON);
    });

    it('should return configured default bullet icon', function() {
	var ctrl = new VerticalMenuController();
	var icon = 'my-custom-icon';
	ctrl.config = {
		default : {
		    icon : icon
		}
	};
	expect(ctrl.getDefaultIcon()).to.eql(icon);
    });
    
    it('should return the default bullet icon for item with no icon', function(){
	var ctrl = new VerticalMenuController();
	ctrl.config = {};
	var item = {};
	expect(ctrl.getItemIcon(item)).to.eql(ctrl.DEFAULT_BULLET_ICON);
    });
    
    it('should return configured icon for item', function(){
	var ctrl = new VerticalMenuController();
	ctrl.config = {};
	var icon = 'my-custom-icon';
	var item = {icon : icon};
	expect(ctrl.getItemIcon(item)).to.eql(icon);
    });
    
    
    it('should evaluate if an item does not have any children', function(){
	var ctrl = new VerticalMenuController();
	ctrl.config = {};
	var item = {};
	expect(ctrl.hasChildren(item)).to.eql(false);
    });
    
    it('should evaluate if an item have some children', function(){
	var ctrl = new VerticalMenuController();
	ctrl.config = {};
	var item = {children:[]};
	expect(ctrl.hasChildren(item)).to.eql(true);
    });
    
    it('should activate item with children', function(){
	var ctrl = new VerticalMenuController();
	ctrl.config = {};
	var item = {children:[]};
	ctrl.toggle($.Event('click'),item);
	expect(item.active).to.eql(true);
    });
    
    it('should not activate item without children', function(){
	var ctrl = new VerticalMenuController();
	ctrl.config = {};
	var item = {};
	ctrl.toggle($.Event('click'),item);
	expect(item.active).to.be.undefined;
    });
    
    it('should follow href linked item', inject(function(_$rootScope_, _$location_){
	rootScope = _$rootScope_;
	var ctrl = new VerticalMenuController(rootScope, _$location_);
	ctrl.config = {};
	var path = 'my-path';
	var item = {href:path};
	ctrl.toggle($.Event('click'),item);
	rootScope.$digest();
	expect(_$location_.path()).to.be.equal('/' + path);
    }));
    
    it('should call callback function associated with the item', inject(function(_$rootScope_, _$location_){
	rootScope = _$rootScope_;
	var ctrl = new VerticalMenuController(rootScope, _$location_);
	var callback = function(){};
	ctrl.config = {
		data : [{
		    callback :sinon.spy()
		}]
	};
	var item = ctrl.config.data[0];
	ctrl.toggle($.Event('click'), item);
	expect(item.callback).to.have.been.calledOnce;
	expect(item.callback).to.have.been.calledWith(item);

    }));
});


describe('angular-vertical-directive::directive', function() {
    
    var el, scope, $compile;
    
    beforeEach(module('angularVerticalMenu'));
    
    beforeEach(inject(function(_$compile_, _$rootScope_){
	$compile = _$compile_;
	scope = _$rootScope_.$new();
	
	el = angular.element('<vertical-menu config="config"></vertical-menu>');
    }));
    
    afterEach(function() {
	if (scope) {
	    scope.$destroy();
	}
    });
    
    it('should display menu item', function(){
	var lbl = 'myLabel';
	scope.config = {data:[{label: lbl}]};
	$compile(el)(scope);
	scope.$digest();
	var items = el.find('li');
	expect(items.length).equal(1);
	expect(getLabel(items[0])).equal(lbl);
    });
    
    it('should display menu children when activated', function(){
	scope.config = {data:[{label: 'item', children : [{label:'sub1'}, {label:'sub2'}]}]};
	$compile(el)(scope);
	scope.$digest();
	var item = angular.element(el.find('li')[0]);
	
	var children = item.find('ul');
	expect(children).to.be.empty;
	item.triggerHandler('click');	
	
	expect(item.hasClass('active')).to.be.true;
	
	children = item.find('li');
	expect(children.length).equal(2);
	expect(getLabel(children[0])).equal('sub1');
	expect(getLabel(children[1])).equal('sub2');
    });
    
    /**
     * Returns the label associated with the given item
     */
    function getLabel(item) {
	var span = angular.element(item).find('span');
	return angular.element(span).text();
    }
    
});