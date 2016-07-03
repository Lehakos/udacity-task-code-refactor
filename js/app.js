/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    var model = {
        init: function() {
            this.attendance = JSON.parse(localStorage.attendance);
        },

        setStudentAttendance: function(name, day, attend) {
            this.attendance[name][day] = attend;
            localStorage.attendance = JSON.stringify(this.attendance);
        },

        getStudentAttendance: function(name) {
            return this.attendance[name];
        }
    };

    var view = {
        init: function() {
            var that = this;

            this.$students = $('.student');

            this.$students.each(function(ind, student) {
                var $student = $(student);

                that.drawTotal($student);
                that.checkAttendance($student);

                $student.on('change', function(e) {
                    var $dayChecks = that.getStudentDayChecks($student),
                        $checkbox = $dayChecks.filter($(e.target));

                    if ($checkbox.length) {
                        var day = $dayChecks.index($checkbox),
                            attend = $checkbox.prop('checked');

                        controller.setStudentAttendance($student, day, attend);
                    }
                });
            });
        },

        getStudentName: function($student) {
            var name = $student.find('.name-col').text();

            return name;
        },

        getStudentDayChecks: function($student) {
            var $days = $student.find('.attend-col'),
                $dayChecks = $days.find('input[type="checkbox"]');

            return $dayChecks;
        },

        checkAttendance: function($student) {
            var $dayChecks = this.getStudentDayChecks($student),
                attendance = controller.getStudentAttendance($student);

            $dayChecks.each(function(i) {
                $(this).prop('checked', attendance[i]);
            });
        },

        drawTotal: function($student) {
            var total = controller.getTotalMissed($student);

            $student.find('.missed-col').text(total);
        }
    };

    var controller = {

        init: function() {
            model.init();
            view.init();
        },

        setStudentAttendance: function($student, day, attend) {
            var name = view.getStudentName($student);

            model.setStudentAttendance(name, day, attend);
            view.drawTotal($student);
        },

        getStudentAttendance: function($student) {
            var name = view.getStudentName($student);

            return model.getStudentAttendance(name);
        },

        getTotalMissed: function($student) {
            var total = 0,
                name = view.getStudentName($student),
                attendance = model.getStudentAttendance(name);

            attendance.forEach(function(day) {
                if (!day) {
                    total += 1;
                }
            });

            return total;
        }
    };

    controller.init();
}());
