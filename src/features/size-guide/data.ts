export const DOBOK_SIZE_CHART = [
  { size: '110', height: '100–110', chest: '56–58', waist: '52–54', suitable: 'Child 4–5' },
  { size: '120', height: '110–120', chest: '58–60', waist: '54–56', suitable: 'Child 6–7' },
  { size: '130', height: '120–130', chest: '60–64', waist: '56–58', suitable: 'Child 8–9' },
  { size: '140', height: '130–140', chest: '64–68', waist: '58–60', suitable: 'Child 10–11' },
  { size: '150', height: '140–150', chest: '68–72', waist: '60–62', suitable: 'Youth 12–13' },
  { size: '160', height: '150–160', chest: '72–76', waist: '62–64', suitable: 'Youth 14–15' },
  { size: '170', height: '160–170', chest: '76–82', waist: '64–68', suitable: 'Junior / small adult' },
  { size: '180', height: '170–180', chest: '82–88', waist: '68–72', suitable: 'Adult S' },
  { size: '190', height: '180–190', chest: '88–94', waist: '72–76', suitable: 'Adult M' },
  { size: '200', height: '190–200', chest: '94–100', waist: '76–82', suitable: 'Adult L' },
  { size: '210', height: '200+', chest: '100–108', waist: '82–88', suitable: 'Adult XL' },
] as const;

export const MEASUREMENT_STEPS = [
  {
    title: 'Height',
    description: 'Stand barefoot against a wall. Mark the top of your head and measure floor to mark.',
  },
  {
    title: 'Chest',
    description: 'Measure around the fullest part of the chest, keeping the tape level under the arms.',
  },
  {
    title: 'Waist',
    description: 'Measure around the natural waistline — typically just above the navel for doboks.',
  },
  {
    title: 'Inseam (optional)',
    description: 'From crotch to ankle along the inside leg — helpful for custom pant lengths.',
  },
] as const;

export const FIT_TIPS = [
  'Competition doboks should fit close to the body without restricting high kicks or spins.',
  'If between sizes, size up for growing youth athletes; adults often prefer a snug competition fit.',
  'Custom team orders can adjust sleeve and pant length — note this in your order brief.',
  'Wash new uniforms once before first wear; cotton blends may relax slightly after washing.',
] as const;
