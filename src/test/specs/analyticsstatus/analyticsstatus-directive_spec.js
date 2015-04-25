describe('Analytis status directive', function () {
    var element;
    var scope;
    var $timeout;

    beforeEach(module('PEPFAR.approvals', function ($provide) {
        $provide.factory('analyticsStatus', function ($q) {
            return {
                getIntervalSinceLastAnalyticsTableSuccess: jasmine.createSpy()
                    .andReturn($q.when(fixtures.get('system/info').intervalSinceLastAnalyticsTableSuccess))
            };
        });
    }));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $timeout = $injector.get('$timeout');
        element = angular.element('<analytics-status></analytics-status>');

        scope = $rootScope.$new();
        element = $compile(element)(scope).children().first();
        scope.$digest();
    }));

    it('should compile to a div', function () {
        expect(element.prop('tagName')).toBe('DIV');
    });

    it('should show the time of the last update', function () {
        expect(element[0].textContent).toEqual('Data was updated 996 h, 36 m, 11 s ago');
    });

    it('should update the time after a certain period', inject(function (analyticsStatus, $q) {
        expect(element[0].textContent).toEqual('Data was updated 996 h, 36 m, 11 s ago');

        analyticsStatus.getIntervalSinceLastAnalyticsTableSuccess
            .andReturn($q.when('0 h, 36 m, 11 s'));

        $timeout.flush(30000);

        expect(element[0].textContent).toEqual('Data was updated 0 h, 36 m, 11 s ago');
    }));

    it('should not display anything if the status update failed', inject(function (analyticsStatus, $q) {
        expect(element[0].textContent).toEqual('Data was updated 996 h, 36 m, 11 s ago');

        analyticsStatus.getIntervalSinceLastAnalyticsTableSuccess
            .andReturn($q.reject('Unable to find last updated time'));

        $timeout.flush(30000);

        expect(element[0].textContent).toEqual('Unable to find last updated time');
    }));
});