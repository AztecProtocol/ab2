pub global SCALE: u64 = 1000000;

pub fn log(x: u64) -> u64 {
    assert(x != 0, "Logarithm undefined for non-positive values.");

    let y = (x * SCALE) / SCALE;

    let mut result = 0;
    let mut numerator = (y - SCALE);
    let mut power = numerator;
    let MAX_ITERATIONS = 10;

    for i in 1..=MAX_ITERATIONS {
        let term = (power * SCALE) / (i * SCALE);
        if (i % 2 == 1) {
            result += term;
        } else {
            result -= term;
        }
        power = (power * numerator) / SCALE;
    }

    result
}

pub fn exp(x: u64) -> u64 {
    let mut result = SCALE; 
    let mut term = SCALE;
    let mut factorial = 1;
    let mut power = SCALE; 

    let MAX_ITERATIONS = 10;

    for i in 1..=MAX_ITERATIONS {
        factorial *= i;
        power = (power * x) / SCALE;
        term = (power * SCALE) / factorial;
        result += term;
    }

    result
}