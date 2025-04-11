class Resources {
    toLoad: { [key: string]: string };
    images: { [key: string]: { image: HTMLImageElement; isLoaded: boolean } };

    constructor() {
        this.toLoad = {
            sky: "../sprites/Sprout Lands - Sprites - Basic pack/Tilesets/Grass.png",
            g: "../sprites/Sprout Lands - Sprites - Basic pack/Tilesets/Grass.png"
        };

        this.images = {};

        Object.keys(this.toLoad).forEach((key: string) => {
            const img = new Image();
            img.src = this.toLoad[key];
            this.images[key] = {
                image: img,
                isLoaded: false
            };
            img.onload = () => {  // `onload` should be lowercase
                this.images[key].isLoaded = true;
            };
        });
    }
}

export const resources = new Resources();
