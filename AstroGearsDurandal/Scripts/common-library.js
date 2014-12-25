define(function(require) {
    return {
        ErrorIcon: '<span class="fa fa-exclamation-triangle error"></span>',
        SuccessIcon: '<span class="fa fa-check-circle action-successful"></span>',
        IsInRange: function(value, min, max) {
            if ((IsNullOrUndefined(min) || IsNullOrUndefined(max)) || (min > max) || isNaN(value)) {
                return false;
            }
            var intVal = parseInt(value);
            return ((intVal >= min) === (intVal <= max));
        },
        IsNullOrUndefined: function (val) {
            return (typeof val === 'undefined' || val === null);
        }
    }
});