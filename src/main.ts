import * as ss from "simple-statistics";

// CONSTANTS (weight in grams)
let GOAL = 50000;
let NUM_RATS = 20; // number of adult breeding rats in each generation
let INITIAL_MIN_WT = 200;
let INITIAL_MAX_WT = 600;
let INITIAL_MODE_WT = 300;
let MUTATE_ODDS = 0.01;
let MUTATE_MIN = 0.5;
let MUTATE_MAX = 1.2;
const LITTER_SIZE = 8;
const LITTERS_PER_YEAR = 10;
const GENERATION_LIMIT = 500;

//keep breeding pairs even
if (NUM_RATS %2 != 0) {
    NUM_RATS += 1;
}

function populate(NUM_RATS, MIN_WT, MAX_WT, MODE_WT) {
/*Initialize a population with a triangular distribution of weights. */
let weights = Array();
for (let i = 0; i < NUM_RATS; i++) {
    const u = Math.random();
    const x = Math.abs(2* (MODE_WT - MIN_WT) / (MAX_WT - MIN_WT) - 1);
    const t = u < x ? Math.sqrt(u*x): 1 - Math.sqrt((1-u)*(1-x));
    const w = MIN_WT + t*(MAX_WT - MIN_WT);
    let w2 = Math.round(w);
    weights.push(w2);
}
return weights;
}

function fitness(population = Array(), GOAL) {
    /*Measure population fitness based on an attribute mean vs target. */
    const ave = ss.mean.apply(population);
    return ave / GOAL;
}

function select(population = Array(), to_retain) {
    /*Cull a population to contain only a specified number of members. */

    const sorted_population = population.sort();
    const to_retain_by_sex = Math.floor(to_retain / 2);
    const members_per_sex = Math.floor(population.length / 2);
    const females = sorted_population.slice(0, members_per_sex);
    const males = sorted_population.slice(members_per_sex);
    const selected_females = females.slice(-to_retain_by_sex);
    const selected_males = males.slice(-to_retain_by_sex);

    return [selected_males, selected_females];
}

function breed(males, females, litter_size) {
    /*Crossover genes among members of a population. */

    males.sort(() => Math.random() - 0.5);
    females.sort(() => Math.random() - 0.5);

    const children = [];
    for (let i = 0; i < females.length; i++) {
        const male = males[i % males.length];
        const female = females[i];
    }

    return children;
}

function mutate(children, mutate_odds, mutate_min, mutate_max) {
    /*Randomly alter rat weights using input odds and fractional changes. */
    for (let index = 0; index < children.length; index++) {
        const rat = children[index];
        if (mutate_odds >= Math.random()) {
            children[index] = Math.round(rat * Math.random() * (mutate_max - mutate_min) + mutate_min); 
        }
    }
    return children;
}

function main() {
    /*Initiate population, select, breed, and mutate, display results */
    let generations = 0;

    let parents = populate(NUM_RATS, INITIAL_MIN_WT, INITIAL_MAX_WT, INITIAL_MODE_WT);
    console.log("Initial population weights = ", parents);

    let popl_fitness = fitness(parents, GOAL);
    console.log("Initial population fitness = ", popl_fitness);
    console.log("number to retain = ", NUM_RATS);

    const ave_wt = [];

    while (popl_fitness < 1 && generations < GENERATION_LIMIT){
        const [selected_males, selected_females] = select(parents, NUM_RATS);
        let children = breed(selected_males, selected_females, LITTER_SIZE);
        children = mutate(children, MUTATE_ODDS, MUTATE_MIN, MUTATE_MAX);
        parents.push(...selected_males, ...selected_females, ...children);
        console.log("Generation ", generations,  "fitness = ", popl_fitness.toFixed(4));
        console.log("foo", parents);
        ave_wt.push.apply(ss.mean(parents));
        generations++;
    }
    console.log("average weight per generation = ", ave_wt);
    console.log("\nnumber of generations = ", generations);
    console.log("number of years = ", generations / LITTERS_PER_YEAR);

}

if (require.main === module) {
    const start_time = Date.now();
    main();
    const end_time = Date.now();
    const duration = (end_time - start_time)/1000;
    console.log(`\nRuntime for this program was ${duration} seconds.`);
}