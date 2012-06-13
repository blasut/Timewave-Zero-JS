var TRUE = 1;
var FALSE = 0;
var MAX_DATA_POINTS = 400;
var MAX_INPUT_LENGTH = 14;
var NUM_POWERS = 20;
var CALC_PREC = 10;

/*  storage allocation  */
var wave_factor = 64; /*  the usual value  */
var num_data_points;
var w = []; /*  array holding the values  */

var buffer = []; /*  input buffer  */
var powers = []; /*  powers of wave_factor  */



/*-----------*/

function main() {
    var i;
    var days;

    read_data_points();

    console.log("Number of data points", num_data_points);

    if (num_data_points < 4) {
        alert("Not enough values in data file.");
        return;
    }

    /*  put powers[i] = wave_factor^i  */
    powers[0] = 1;
    for (i = 1; i < NUM_POWERS; i++) {
        powers[i] = wave_factor * powers[i - 1];
    }

    console.log("This program calculates the value of the timewave");
    console.log("for a given number of days prior to the zero point.");
    console.log("To quit, press Enter.");

}

function valueOnDay(x) {
    var i;
    var sum = 0;

    if (x) {
        for (i = 0; x >= powers[i]; i++) {
            var part_1 = div_power(x, i);
            var part_2 = v(part_1);
            var part_3 = mult_power(part_2, i);
            sum += part_3;
        }

        i = 0;

        while (sum < powers[CALC_PREC - i + 2]) {
            if (++i > CALC_PREC + 2) {
                break;
            }

            sum += div_power(v(mult_power(x, i)), i);
        };
/*  sum < powers[CALC_PREC-i+2] if and only if
         *  wave_factor^2/powers[i] > sum/powers[CALC_PREC]
         *  CALC_PREC defined as 10 in TWZ_DEF.H
         */
    }

/*  dividing by 64^3 gives values consistent with the Apple // version
     *  and provides more convenient y-axis labels
     */
    return (div_power(sum, 3));
}

function fmod(a, b) {
    return a % b;
}

/*--------------*/

function v(y) {
    var i = fmod(y, num_data_points);
    var j = (i + 1) % num_data_points;
    var z = y - Math.floor(y);
    i = Math.floor(i);
    j = Math.floor(j);

    return (z === 0.0 ? w[i] : (w[j] - w[i]) * z + w[i]);
}

/*  in order to speed up the calculation, if wave factor = 64
 *  then instead of using multiplication or division operation
 *  we act directly on the floating point representation;
 *  multiplying by 64^i is accomplished by adding i*0x60
 *  to the exponent (the last 2 bytes of the 8-byte representation);
 *  dividing by 64^i is accomplished by subtracting i*0x60
 *  from the exponent
 */

/*-----------------------*/

function mult_power(x, i) {
    var exponent = x + 3;
    i = Math.floor(i);
    x *= powers[i];

    return (x);
}

/*----------------------*/

function div_power(x, i) {
    var exponent = x + 3;
    i = Math.floor(i);

    x /= powers[i];

    return (x);
}

/*  read integer values from the data file
 *  (normally DATA.TWZ) into the array w[];
 *  all values must be non-negative
 *  returns 0 if data read ok, otherwise an error code:
 *  -1 = file not found,
 *  -2 = error when opening file,
 *  -3 = error when reading file
 */
/*----------------------*/

function read_data_points() {

    var oldPoints = [0, 63, 63, 36, 28, 31, 3, 25, 25, 44, 88, 74, 26, 56, 57, 51, 46, 49, 8, 58, 56, 66, 71, 76, 39, 31, 29, 29, 36, 34, 18, 14, 17, 25, 15, 11, 16, 25, 19, 15, 20, 21, 15, 22, 26, 9, 17, 13, 43, 39, 34, 35, 24, 22, 25, 23, 29, 15, 13, 11, 22, 24, 25, 19, 21, 21, 48, 44, 49, 41, 28, 29, 33, 46, 45, 47, 38, 41, 3, 29, 37, 51, 46, 55, 11, 17, 19, 22, 24, 21, 31, 14, 22, 14, 10, 20, 42, 43, 39, 26, 28, 20, 11, 26, 16, 14, 21, 16, 30, 45, 43, 41, 27, 32, 25, 20, 18, 12, 19, 32, 16, 23, 18, 20, 19, 20, 28, 19, 18, 21, 21, 21, 16, 32, 31, 20, 33, 29, 25, 28, 16, 14, 24, 20, 31, 22, 23, 21, 23, 23, 28, 27, 29, 25, 29, 26, 30, 4, 14, 14, 39, 37, 14, 14, 25, 56, 44, 34, 26, 47, 49, 50, 54, 55, 14, 19, 31, 33, 31, 38, 33, 33, 32, 32, 38, 36, 12, 10, 8, 26, 49, 50, 12, 15, 15, 14, 46, 41, 3, 37, 33, 16, 40, 26, 14, 44, 45, 39, 34, 37, 32, 28, 26, 36, 41, 46, 45, 37, 35, 35, 42, 40, 24, 38, 39, 19, 57, 53, 34, 43, 37, 33, 20, 23, 37, 20, 18, 19, 17, 17, 49, 45, 40, 41, 30, 28, 7, 5, 11, 23, 27, 29, 16, 20, 13, 23, 9, 9, 24, 24, 25, 31, 36, 35, 21, 14, 19, 11, 2, 5, 21, 5, 13, 27, 22, 31, 11, 41, 43, 30, 26, 25, 31, 22, 18, 50, 46, 56, 54, 31, 27, 14, 16, 12, 19, 38, 28, 26, 19, 20, 18, 9, 7, 5, 49, 42, 25, 16, 18, 14, 7, 8, 16, 27, 28, 32, 35, 36, 22, 47, 48, 33, 27, 29, 28, 28, 27, 32, 29, 31, 49, 10, 4, 10, 42, 38, 25, 36, 25, 25, 11, 15, 10, 21, 23, 19, 23, 20, 24, 22, 32, 20, 21, 19, 12, 8, 7, 38, 26, 16, 14, 33, 33, 22, 14, 13, 8, 13, 25, 27, 25, 32, 27, 63, 62, 62, 68, 66, 22, 16, 16, 38, 61, 62];

    var points = [ 0,  0,  0,  2,  7,  4,  3,  2,  6,  8,
                        13,  5, 26, 25, 24, 15, 13, 16, 14, 19,
                        17, 24, 20, 25, 63, 60, 56, 55, 47, 53,
                        36, 38, 39, 43, 39, 35, 22, 24, 22, 21,
                        29, 30, 27, 26, 26, 21, 23, 19, 57, 62,
                        61, 55, 57, 57, 35, 50, 40, 29, 28, 26,
                        50, 51, 52, 61, 60, 60, 42, 42, 43, 43,
                        42, 41, 45, 41, 46, 23, 35, 34, 21, 21,
                        19, 51, 40, 49, 29, 29, 31, 40, 36, 33,
                        29, 26, 30, 16, 18, 14, 66, 64, 64, 56,
                        53, 57, 49, 51, 47, 44, 46, 47, 56, 51,
                        53, 25, 37, 30, 31, 28, 30, 36, 35, 22,
                        28, 32, 27, 32, 34, 35, 52, 49, 48, 51,
                        51, 53, 40, 43, 42, 26, 30, 28, 55, 41,
                        53, 52, 51, 47, 61, 64, 65, 39, 41, 41,
                        22, 21, 23, 43, 41, 38, 24, 22, 24, 14,
                        17, 19, 52, 50, 47, 42, 40, 42, 26, 27,
                        27, 34, 38, 33, 44, 44, 42, 41, 40, 37,
                        33, 31, 26, 44, 34, 38, 46, 44, 44, 36,
                        37, 34, 36, 36, 36, 38, 43, 38, 27, 26,
                        30, 32, 37, 29, 50, 49, 48, 29, 37, 36,
                        10, 19, 17, 24, 20, 25, 53, 52, 50, 53,
                        57, 55, 34, 44, 45, 13,  9,  5, 34, 26,
                        32, 31, 41, 42, 31, 32, 30, 21, 19, 23,
                        43, 36, 31, 47, 45, 43, 47, 62, 52, 41,
                        36, 38, 46, 47, 40, 43, 42, 42, 36, 38,
                        43, 53, 52, 53, 47, 49, 48, 47, 41, 44,
                        15, 11, 19, 51, 40, 49, 23, 23, 25, 34,
                        30, 27,  7,  4,  4, 32, 22, 32, 68, 70,
                        66, 68, 79, 71, 43, 45, 41, 38, 40, 41,
                        24, 25, 23, 35, 33, 38, 43, 50, 48, 18,
                        17, 26, 34, 38, 33, 38, 40, 41, 34, 31,
                        30, 33, 33, 35, 28, 23, 22, 26, 30, 26,
                        75, 77, 71, 62, 63, 63, 37, 40, 41, 49,
                        47, 51, 32, 37, 33, 49, 47, 44, 32, 38,
                        28, 38, 39, 37, 22, 20, 17, 44, 50, 40,
                        32, 33, 33, 40, 44, 39, 32, 32, 40, 39,
                        34, 41, 33, 33, 32, 32, 38, 36, 22, 20,
                        20, 12, 13, 10];

    num_data_points = points.length;

    w = points;

    return true;
}
console.log("starting twzJS");
main();