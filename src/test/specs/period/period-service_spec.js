describe('Period service', function () {
    var service;

    beforeEach(module('d2-rest'));
    beforeEach(module('PEPFAR.approvals'));
    beforeEach(inject(function (periodService) {
        service = periodService;
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    it('should expose the getPastPeriodsRecentFirst periods', function () {
        expect(service.getPastPeriodsRecentFirst).toBeAFunction();
    });

    it('should have the period types', function () {
        var periodTypes = [
            "Daily",
            "Weekly",
            "Monthly",
            "BiMonthly",
            "Quarterly",
            "SixMonthly",
            "SixMonthlyApril",
            "Yearly",
            "FinancialApril",
            "FinancialJuly",
            "FinancialOct"
        ];

        expect(service.getPeriodTypes()).toEqual(periodTypes);
    });

    it('should have the calendar types', function () {
        var calendarTypes = [
            'coptic',
            'ethiopian',
            'islamic',
            'julian',
            'nepali',
            'thai'
        ];

        expect(service.getCalendarTypes()).toEqual(calendarTypes);
    });

    it('should have a getDateFormat method', function () {
        expect(service.getDateFormat).toBeAFunction();
    });

    describe('dateFormat', function () {
        var $httpBackend;

        beforeEach(inject(function (_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));

        it('should return the default date format', function () {
            expect(service.getDateFormat()).toBe('yyyy-mm-dd');
        });

        it('should return the dateformat after it has been loaded', function () {
            $httpBackend.expectGET('/dhis/api/system/info')
                .respond(200, {
                    calendar: "iso8601",
                    dateFormat: "dd-mm-yyyy"
                });
            $httpBackend.flush();

            expect(service.getDateFormat()).toBe('dd-mm-yyyy');
        });
    });

    describe('getCalendarType', function () {
        var $httpBackend;

        beforeEach(inject(function (_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));

        //TODO: check what to do about this
        it('should return undefined for the default calendar', function () {
            expect(service.getCalendarType()).toBe(undefined);
        });

        it('should return iso8601 when loaded from the api', function () {
            $httpBackend.expectGET('/dhis/api/system/info')
                .respond(200, {
                    calendar: "iso8601",
                    dateFormat: "yyyy-mm-dd"
                });
            $httpBackend.flush();

            expect(service.getCalendarType()).toBe('gregorian');
        });

        it('should set the nepali calendar after loading from the api', function () {
            //Mock the getScript call for javascript
            spyOn(service, 'loadCalendarScript');

            $httpBackend.expectGET('/dhis/api/system/info')
                .respond(200, {
                    calendar: "nepali",
                    dateFormat: "yyyy-mm-dd"
                });
            $httpBackend.flush();

            expect(service.getCalendarType()).toBe('nepali');
        });

        it('should load the script for the nepali calendar', function () {
            spyOn(service, 'loadCalendarScript');

            $httpBackend.expectGET('/dhis/api/system/info')
                .respond(200, {
                    calendar: "nepali",
                    dateFormat: "yyyy-mm-dd"
                });
            $httpBackend.flush();

            expect(service.loadCalendarScript).toHaveBeenCalled();
        });

        it('should not request the script when it is not a calendar type', function () {
            spyOn(service, 'loadCalendarScript');

            $httpBackend.expectGET('/dhis/api/system/info')
                .respond(200, {
                    calendar: "fakenotexist",
                    dateFormat: "yyyy-mm-dd"
                });
            $httpBackend.flush();

            expect(service.loadCalendarScript).not.toHaveBeenCalled();
        });
    });

    //TODO: Mock out the period generator
    describe('getPastPeriodsRecentFirst', function () {
        it('should return periods', function () {
            var periods = service.getPastPeriodsRecentFirst('Monthly', 0);

            expect(periods).toBeAnArray();
        });
    });
});
