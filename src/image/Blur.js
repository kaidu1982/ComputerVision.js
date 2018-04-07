/**
 * https://blog.naver.com/shmarion/10133178118 블러의 종류 (포토샵?)
 *
 * bilateralFilter는 직접 구현해보고 싶다.
 * https://en.wikipedia.org/wiki/Bilateral_filter
 */
export default class Blur {

    /**
     * https://stackoverflow.com/questions/8204645/implementing-gaussian-blur-how-to-calculate-convolution-matrix-kernel
     * https://en.wikipedia.org/wiki/Gaussian_blur#cite_note-ShapiroStockman-1
     * in two demensions
     * @param x
     * @param y
     * @param mu
     * @param sigma
     */
    static toKernelValue(x, y, mu, sigma) {
        return Math.exp( -0.5 * (Math.pow((x-mu)/sigma, 2.0) + Math.pow((y-mu)/sigma, 2.0)) )
        / (2 * Math.PI * sigma * sigma);
    }

    static makeKernelGaussian(width, height, mu, sigma) {
        let kernel = [];
        let sum = 0;

        for(let x=0; x<width; x++) {
            kernel[x] = [];
            for(let y=0; y<height; y++) {
                kernel[x][y] = this.toKernelValue(x, y, mu, sigma);

                sum += kernel[x][y];
            }
        }

        //Normalize the kernel
        for(let x=0; x<width; x++) {
            for (let y = 0; y < height; y++) {
                kernel[x][y] /= sum;
            }
        }

        return kernel;
    }

    /**
     * 1600 X 1000, kernel(7 X 7)
     * Time 0.75 sec
     *
     * @param pixel
     * @param width
     * @param height
     * @param blurWidth
     * @param sigma
     * @returns {*}
     */
    static toGaussianBlurImage(pixel, width, height, blurWidth, sigma) {
        //TODO blurWidth 값이 홀수가 아니라면 에러 처리하자
        let mu = blurWidth/2 - 1;
        let kernel = this.makeKernelGaussian(blurWidth, blurWidth, mu, sigma);

        return this.convolve(pixel, width, height, kernel);
    }

    /**
     * 만들어진 필터를 연산하는 메소드
     * (kernel-1) / 2 사이즈 만큼의 코너픽셀은 연산을 제외한다.
     */
    static convolve(pixels, width, height, kernel) {
        let resultPixels = new Uint8ClampedArray(pixels.length);

        const kernelSize = kernel.length;
        let padding = (kernelSize - 1) / 2;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                const offset = ((y) * width + (x)) * 4;

                if(padding+1 <= x && x <width-padding && padding+1 <= y && y < height-padding) {
                    const rgb = this.calculatePixel(x, y, kernel, pixels, width);

                    resultPixels[offset] = rgb.r;
                    resultPixels[offset+1] = rgb.g;
                    resultPixels[offset+2] = rgb.b;
                    resultPixels[offset+3] = pixels[offset+3];
                } else {
                    resultPixels[offset] = pixels[offset];
                    resultPixels[offset+1] = pixels[offset+1];
                    resultPixels[offset+2] = pixels[offset+2];
                    resultPixels[offset+3] = pixels[offset+3];
                }
            }
        }

        return resultPixels;
    }

    /**
     * @param x
     * @param y
     * @param kernel
     * @param originalPixels
     * @param imageWidth
     * @returns {{r: number, g: number, b: number}}
     */
    static calculatePixel(x, y, kernel, originalPixels, imageWidth) {
        //수치를 변경할 픽셀.
        let r=0, g=0, b=0;
        const kernelSize = kernel.length;
        const padding = (kernelSize - 1) / 2;


        for(let relativeX = -padding; relativeX<= padding; relativeX++) {
            for(let relativeY = -padding; relativeY<= padding; relativeY++) {
                const offset = ((y+relativeY) * imageWidth + (x+relativeX)) * 4;

                const kernelX = relativeX + padding;
                const kernelY = relativeY + padding;


                r += originalPixels[offset] * kernel[kernelY][kernelX];
                g += originalPixels[offset+1] * kernel[kernelY][kernelX];
                b += originalPixels[offset+2] * kernel[kernelY][kernelX];
            }
        }


        return {r: r, g: g, b: b};
    }
}