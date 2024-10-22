pub global DESCRIPTOR_SIZE: u32 = 128;

pub type Descriptor = [i32; DESCRIPTOR_SIZE];

pub fn sqrt(num: u32) -> u32 {
    let mut guess = num;
    for _ in 0..12 {
        guess = (guess + num / guess) / 2;
    }
    guess
}

pub fn get_euclidean_distance(actual: Descriptor, given: Descriptor) -> u32 {
    let mut distance: u32 = 0;
    for i in 0..DESCRIPTOR_SIZE {
        let diff: i32 = actual[i] - given[i];
        let squared_diff: u32 = (diff * diff) as u32;
        distance += squared_diff;
    }
    distance = sqrt(distance);
    distance
}
