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
let X_OFFSET = 0;

// Create sliders
let barsSlider, quadSlider, spacingSlider, sineSlider, 
    heightSlider, peakSlider, xOffsetSlider;

function setup() {
    createCanvas(1080, 720);
    
    // Create sliders with labels and store them in variables
    createDiv('Number of Bars:')
        .position(20, 20);
    barsSlider = createSlider(5, 15, 10, 1)
        .position(20, 40);
    barsSlider.input(() => BARS_X = barsSlider.value());
    
    createDiv('Quad Point:')
        .position(200, 20);
    quadSlider = createSlider(0, 40, 0, 1)
        .position(200, 40);
    quadSlider.input(() => QUAD_POINT = quadSlider.value());
    
    createDiv('Bar Spacing:')
        .position(350, 20);
    spacingSlider = createSlider(0, 20, 2, 1)
        .position(350, 40);
    spacingSlider.input(() => BAR_SPACING = spacingSlider.value());
    
    createDiv('Sine Amplitude:')
        .position(500, 20);
    sineSlider = createSlider(0, 1, 0, 0.1)
        .position(500, 40);
    sineSlider.input(() => SINE_AMPLITUDE = sineSlider.value());
    
    createDiv('Height Amplitude:')
        .position(650, 20);
    heightSlider = createSlider(0, 1, 0, 0.1)
        .position(650, 40);
    heightSlider.input(() => HEIGHT_AMPLITUDE = heightSlider.value());
    
    createDiv('Peak Position:')
        .position(800, 20);
    peakSlider = createSlider(0, 1, 0.5, 0.1)
        .position(800, 40);
    peakSlider.input(() => PEAK_POSITION = peakSlider.value());
    
    createDiv('X Offset:')
        .position(950, 20);
    xOffsetSlider = createSlider(-100, 50, 0, 1)
        .position(950, 40);
    xOffsetSlider.input(() => X_OFFSET = xOffsetSlider.value());
}

function draw() {
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
    
    let scale = min(1, width / totalWidth);
    
    // Starting x position with scroll offset
    let x = (width - (totalWidth * scale)) / 2 - scrollOffset;
    
    // Draw two sets of bars for seamless scrolling
    for (let set = 0; set < 2; set++) {
        let xPos = x + (set * totalWidth * scale);
        
        for (let i = 0; i < BARS_X; i++) {
            let barW = barWidths[i] * scale;
            
            // Calculate offsets
            let staticOffset = QUAD_POINT;
            let waveOffset = SINE_AMPLITUDE * sin(rotationOffset + (i * 0.5)) * QUAD_POINT;
            let dynamicOffset = staticOffset + waveOffset;
            
            // Height animation
            let heightMod = HEIGHT_AMPLITUDE * sin(rotationOffset * 0.5 + (i * 0.3));
            let currentBarH = barH * (1 - (HEIGHT_AMPLITUDE * 0.8) + heightMod * 0.8);
            
            // Draw quad with X_OFFSET
            quad(
                xPos, height/2 - currentBarH/2,
                xPos + barW + X_OFFSET, height/2 - currentBarH/2 - dynamicOffset,
                xPos + barW + X_OFFSET, height/2 + currentBarH/2 + dynamicOffset,
                xPos, height/2 + currentBarH/2
            );
            
            xPos += barW + (BAR_SPACING * scale);
        }
    }
    
    // Update scroll position
    scrollOffset += SCROLL_SPEED;
    if (scrollOffset > totalWidth * scale) {
        scrollOffset = 0;
    }
    
    // Update rotation offset
    rotationOffset += 0.05;
} 