# Musical Sniffle 👃💨🎵

<p align="center">
	<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

## Description

Musical Sniffle is designed to be an open source oriented organization to store [my](https://github.com/BensonBen) implementations of Sobels' Algorithm.

## Current State

- [x] Able to use Sobels' Algorithm with NodeJS.
- [x] Able to use Sobels' Algorithm with Angular.

## Table of Contents

- [Built With](#built-with)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)

## Built With

- [NX](https://nx.dev) Mono-Repo / Complexity Management
- [Angular](https://angular.io/) Web Framework
- [ESLint](https://eslint.org) Style Adherence
- [Jest](https://jestjs.io) Frontend Testing
- [Node JS](https://nodejs.org/en/) Backend

## Usage

1.  Usage with Node JS 16.x and [sharp](https://github.com/lovell/sharp)

```typescript
// using this implementation requires the ability to create a 
import * as sharp from 'sharp';
import { SobelService } from '@musical-sniffle/sobel-edge-detection';

const sobelService = new SobelService();
// sobel's algorithm uses grayscale image data.
const { data, info } = await sharp(`${__dirname}/my-image.png`)
  .ensureAlpha()
  .grayscale()
  // optional, but useful to do blur beforehand.
  // .blur(3)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, channels, height } = info;
const { imageData: detected } = sobelService.applySobel(
  new Uint8ClampedArray(data.buffer),
  width,
  height,
  channels
);
const imagename = `${__dirname}/edge-detected-image.png`;
await sharp(detected, { raw: { channels: 4, height, width } }).toFile(
  imagename
);
```

2.  Usage with Angular 13.x.x

```typescript
import { SobelService } from '@musical-sniffle/sobel-edge-detection';

@Component({
  selector: 'my-component',
  template: `<div class="graph-paper">
    <canvas id="canvas" #canvas width="100%" height="100%"></canvas>
  </div> `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }

      .graph-paper {
        z-index: 10;
        background-size: 40px 40px;
        background-image: linear-gradient(to right, lightgray 1px, transparent 1px),
          linear-gradient(to bottom, lightgray 1px, transparent 1px);
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [SobelService],
})
export class GraphPaperComponent implements AfterViewInit {
   /**
    * The encoded image here is in base64 and is not currently grayscaled.
    * 
    * You can forego a lot of code here by simply grayscaling the image on the backend before applying sobel.
    */
  @Input() set img(encodedImg: string) {
    if (!(encodedImg == null)) {
      const tempHtmlElement = new Image();
      tempHtmlElement.onload = event$ => {
        this.canvas.nativeElement.width = tempHtmlElement.width;
        this.canvas.nativeElement.height = tempHtmlElement.height;
        // start: remove if image already grayscaled.
        (this.context as CanvasRenderingContext2D).filter = 'grayscale(1)';
        this.context?.drawImage(tempHtmlElement, 0, 0, tempHtmlElement.width, tempHtmlElement.height);
        // end: remove if image already grayscaled.
        const grayscaled = this.context?.getImageData(0, 0, tempHtmlElement.width, tempHtmlElement.height);
        const { imageData } = this.sobelService.applySobel(
          grayscaled?.data,
          grayscaled?.width ?? 0,
          grayscaled?.height ?? 0,
          4
        );
        this.context?.putImageData(
          new ImageData(imageData, tempHtmlElement?.width ?? 0, tempHtmlElement?.height ?? 0),
          0,
          0
        );
      };
      tempHtmlElement.src = encodedImg;
    }
  }

  @ViewChild('canvas') private readonly canvas!: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D | null = this.canvas?.nativeElement?.getContext('2d');

  constructor(private readonly elementRef: ElementRef<HTMLDivElement>, private readonly sobelService: SobelService) {}

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    const containerElement: Element | undefined = _first(this.elementRef.nativeElement.children);
  }
}
```

## Contributing

1. Select a task from the availible issues.
2. Clone the git repository and checkout the develop branch if not already on it by default.
3. Ensure you have `nx` installed globally via your flavor of package manager.
4. Ensure you have at least `nodejs 16.x` installed.
5. At a mimimum if you've added code, add tests and run them locally.
   1. run `nx affected:test` to execute unit tests using [jest](https://jestjs.io)
   2. run `nx affected:lint` to execute linting affected by the change.
   3. run `nx affected:build` to execute build affected by the change.
6. Update Documentation as needed.
7. Pull Request
   1. Open a Pull request against the original branch `develop`
   2. Your pull request will build and additional code quality checks will be made.
   3. Be open to criticism after all we're human all human... right? 🤖

## Credits

[Benjamin Benson](https://github.com/BensonBen),
[Rick Astley](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

[MIT License](https://opensource.org/licenses/MIT) © [Benjamin Benson](https://github.com/BensonBen)

```
MIT License

Copyright (c) 2022 Benjamin Benson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
