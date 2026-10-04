export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  kind: string;
  stack: string[];
  github: string;
}

export const projects: Project[] = [
  {
    slug: 'flexy',
    title: 'flexy',
    tagline: 'Bend any 3D geometry along a curve',
    description: 'Three.js library that bends BufferGeometry along curves. Warp any shape to follow a path, stretch it to fit or tile it along the arc.',
    kind: 'Open-source library',
    stack: ['JavaScript', 'Three.js'],
    github: 'https://github.com/ekaratzaferis/flexy',
  },
  {
    slug: 'tess-extrude',
    title: 'tess-extrude',
    tagline: '2D outline in, solid 3D mesh out',
    description: 'TypeScript library that extrudes 2D polygons or SVG paths into Three.js geometry using constrained Delaunay tessellation.',
    kind: 'Open-source library',
    stack: ['TypeScript', 'Three.js', 'WASM'],
    github: 'https://github.com/ekaratzaferis/tess-extrude',
  },
  {
    slug: 'four20',
    title: 'four20',
    tagline: 'Raster → vector → 3D',
    description: 'In-browser image tracing that turns pixels into clean SVG paths, with winding order Three.js can extrude without cleanup.',
    kind: 'Open-source library',
    stack: ['JavaScript', 'SVG', 'Three.js'],
    github: 'https://github.com/ekaratzaferis/four20',
  },
  {
    slug: 'stannis',
    title: 'Stannis',
    tagline: 'Durable workflows for serverless Node.js',
    description: 'Finite-state-machine workflow engine. Survives cold starts, storage-agnostic, zero dependencies.',
    kind: 'Open-source library',
    stack: ['Node.js', 'FSM', 'Serverless'],
    github: 'https://github.com/ekaratzaferis/stannis',
  },
  {
    slug: 'fpga',
    title: 'Cloud Terminal',
    tagline: 'Peripherals on the desk, compute in the cloud',
    description: 'University thesis: an FPGA thin client that bridges keyboard, mouse and display to a remote server over Ethernet.',
    kind: 'University thesis',
    stack: ['FPGA', 'VHDL', 'C#', 'Networking'],
    github: 'https://github.com/ekaratzaferis/fpga_clould_client',
  },
];

export const companies = [
  {
    name: 'THEFUTUREOFJEWELRY',
    role: 'Software Architect',
    period: '2020 – Present',
    url: 'https://thefutureofjewelry.com',
    note: 'Custom jewelry platform. I designed and own the core product architecture.',
  },
  {
    name: 'Viral Loops',
    role: 'Software Engineer',
    period: '2018 – 2020',
    url: 'https://viral-loops.com',
    note: 'Viral and referral marketing platform, built for campaign-launch traffic spikes.',
  },
  {
    name: 'wappier',
    role: 'Node.js Software Engineer',
    period: '2017',
    url: 'https://wappier.com',
    note: 'Revenue management and engagement platform for mobile apps.',
  },
];
