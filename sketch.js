// Global variables
let BARS_X = 10;
let MIN_WIDTH = 10;
let MAX_WIDTH = 250;
let BAR_SPACING = 10;
let QUAD_POINT = 25;
let rotationOffset = 0;
let SINE_AMPLITUDE = 0;
let scrollOffset = 0;
let SCROLL_SPEED = 0;
let HEIGHT_AMPLITUDE = 0;
let PEAK_POSITION = 0.5;

// Create sliders
let barsSlider, quadSlider, spacingSlider, sineSlider, 
    heightSlider, peakSlider;

function setup() {
    createCanvas(1080, 720);
    
    // Create sliders with labels - remove 'let' to use global variables
    createDiv('Number of Bars:')
        .position(20, 20);
    barsSlider = createSlider(5, 15, 10, 1)
        .position(20, 40);
    
    createDiv('Quad Point:')
        .position(200, 20);
    quadSlider = createSlider(0, 40, 0, 1)
        .position(200, 40);
    
    createDiv('Bar Spacing:')
        .position(350, 20);
    spacingSlider = createSlider(0, 20, 2, 1)
        .position(350, 40);
    
    createDiv('Sine Amplitude:')
        .position(500, 20);
    sineSlider = createSlider(0, 1, 0, 0.1)
        .position(500, 40);
    
    createDiv('Height Amplitude:')
        .position(650, 20);
    heightSlider = createSlider(0, 1, 0, 0.1)
        .position(650, 40);
    
    createDiv('Peak Position:')
        .position(800, 20);
    peakSlider = createSlider(0, 1, 0.5, 0.1)
        .position(800, 40);
}

function draw() {
    // Update global variables from sliders at the start of each draw
    BARS_X = barsSlider.value();
    QUAD_POINT = quadSlider.value();
    BAR_SPACING = spacingSlider.value();
    SINE_AMPLITUDE = sineSlider.value();
    HEIGHT_AMPLITUDE = heightSlider.value();
    PEAK_POSITION = peakSlider.value();
    
    background(255);
    fill(0);
    stroke(255);
    
    let barH = height * 0.8;
    let totalWidth = 0;
    let barWidths = new Array(int(BARS_X));
    
    // Calculate bar widths
    for (let i = 0; i < BARS_X; i++) {
        let normalizedPosition = i / (BARS_X - 1.0);
        let distanceFromPeak = abs(normalizedPosition - PEAK_POSITION);
        let widthFactor = 1 - distanceFromPeak;
        widthFactor = pow(widthFactor, 3);
        barWidths[i] = map(widthFactor, 0, 1, MIN_WIDTH, MAX_WIDTH);
    }
    
    // Calculate total width including spacing
    for (let i = 0; i < BARS_X; i++) {
        totalWidth += barWidths[i];
    }
    totalWidth += BAR_SPACING * (BARS_X - 1);
    
    // Rename 'scale' to 'scaleRatio' to avoid conflict with p5.js scale() function
    let scaleRatio = min(1, width / totalWidth);
    
    // Starting x position with scroll offset
    let x = (width - (totalWidth * scaleRatio)) / 2 - scrollOffset;
    
    // Draw two sets of bars for seamless scrolling
    for (let set = 0; set < 2; set++) {
        let xPos = x + (set * totalWidth * scaleRatio);
        
        for (let i = 0; i < BARS_X; i++) {
            let barW = barWidths[i] * scaleRatio;
            
            // Update these lines to match the PDE version
            let staticOffset = QUAD_POINT;
            let waveOffset = SINE_AMPLITUDE * sin(rotationOffset + (i * 0.5)) * QUAD_POINT;
            let dynamicOffset = staticOffset + waveOffset;
            
            // Height animation
            let heightMod = HEIGHT_AMPLITUDE * sin(rotationOffset * 0.5 + (i * 0.3));
            let currentBarH = barH * (1 - (HEIGHT_AMPLITUDE * 0.8) + heightMod * 0.8);
            
            // Draw quad with scaled offsets
            quad(
                xPos, height/2 - currentBarH/2,
                xPos + barW, height/2 - currentBarH/2 - dynamicOffset,
                xPos + barW, height/2 + currentBarH/2 + dynamicOffset,
                xPos, height/2 + currentBarH/2
            );
            
            xPos += barW + (BAR_SPACING * scaleRatio);
        }
    }
    
    // Update scroll position
    scrollOffset += SCROLL_SPEED;
    if (scrollOffset > totalWidth * scaleRatio) {
        scrollOffset = 0;
    }
    
    // Update rotation offset
    rotationOffset += 0.05;
} 