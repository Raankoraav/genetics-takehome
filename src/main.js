"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ss = require("simple-statistics");
// CONSTANTS (weight in grams)
var GOAL = 50000;
var NUM_RATS = 20; // number of adult breeding rats in each generation
var INITIAL_MIN_WT = 200;
var INITIAL_MAX_WT = 600;
var INITIAL_MODE_WT = 300;
var MUTATE_ODDS = 0.01;
var MUTATE_MIN = 0.5;
var MUTATE_MAX = 1.2;
var LITTER_SIZE = 8;
var LITTERS_PER_YEAR = 10;
var GENERATION_LIMIT = 500;
//keep breeding pairs even
if (NUM_RATS % 2 != 0) {
    NUM_RATS += 1;
}
function populate(NUM_RATS, MIN_WT, MAX_WT, MODE_WT) {
    /*Initialize a population with a triangular distribution of weights. */
    var weights = Array();
    for (var i = 0; i < NUM_RATS; i++) {
        var u = Math.random();
        var x = Math.abs(2 * (MODE_WT - MIN_WT) / (MAX_WT - MIN_WT) - 1);
        var t = u < x ? Math.sqrt(u * x) : 1 - Math.sqrt((1 - u) * (1 - x));
        var w = MIN_WT + t * (MAX_WT - MIN_WT);
        var w2 = Math.round(w);
        weights.push(w2);
    }
    return weights;
}
function fitness(population, GOAL) {
    if (population === void 0) { population = Array(); }
    /*Measure population fitness based on an attribute mean vs target. */
    var ave = ss.mean(population);
    return ave / GOAL;
}
function select(population, to_retain) {
    /*Cull a population to contain only a specified number of members. */
    if (population === void 0) { population = Array(); }
    var sorted_population = population.sort();
    var to_retain_by_sex = Math.floor(to_retain / 2);
    var members_per_sex = Math.floor(population.length / 2);
    var females = sorted_population.slice(0, members_per_sex);
    var males = sorted_population.slice(members_per_sex);
    var selected_females = females.slice(-to_retain_by_sex);
    var selected_males = males.slice(-to_retain_by_sex);
    return [selected_males, selected_females];
}
function breed(males, females, litter_size) {
    /*Crossover genes among members of a population. */
    males.sort(function () { return Math.random() - 0.5; });
    females.sort(function () { return Math.random() - 0.5; });
    var children = [];
    for (var i = 0; i < females.length; i++) {
        var male = males[i % males.length];
        var female = females[i];
    }
    return children;
}
function mutate(children, MUTATE_ODDS, MUTATE_MIN, MUTATE_MAX) {
    /*Randomly alter rat weights using input odds and fractional changes. */
    for (var index = 0; index < children.length; index++) {
        var rat = children[index];
        if (MUTATE_ODDS >= Math.random()) {
            children[index] = Math.round(rat * Math.random() * (MUTATE_MAX - MUTATE_MIN) + MUTATE_MIN);
        }
    }
    return children;
}
function main() {
    /*Initiate population, select, breed, and mutate, display results */
    var generations = 0;
    var parents = populate(NUM_RATS, INITIAL_MIN_WT, INITIAL_MAX_WT, INITIAL_MODE_WT);
    console.log("Initial population weights = ", parents);
    var popl_fitness = fitness(parents, GOAL);
    console.log("Initial population fitness = ", popl_fitness);
    console.log("number to retain = ", NUM_RATS);
    var ave_wt = Array();
    while (popl_fitness < 1 && generations < GENERATION_LIMIT) {
        var _a = select(parents, NUM_RATS), selected_males = _a[0], selected_females = _a[1];
        var children = breed(selected_males, selected_females, LITTER_SIZE);
        children = mutate(children, MUTATE_ODDS, MUTATE_MIN, MUTATE_MAX);
        parents.push.apply(parents, __spreadArray(__spreadArray(__spreadArray([], selected_males, false), selected_females, false), children, false));
        popl_fitness = fitness(parents, GOAL);
        console.log("Generation ", generations, "fitness = ", popl_fitness.toFixed(4));
        console.log(parents);
        var mean_weight = ss.mean(parents);
        ave_wt.push(mean_weight);
        generations++;
    }
    console.log("\naverage weight per generation = ", ave_wt);
    console.log("\nnumber of generations = ", generations);
    console.log("number of years = ", generations / LITTERS_PER_YEAR);
}
if (require.main === module) {
    var start_time = Date.now();
    main();
    var end_time = Date.now();
    var duration = (end_time - start_time) / 1000;
    console.log("\nRuntime for this program was ".concat(duration, " seconds."));
}
