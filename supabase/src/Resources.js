class Resources {
    constructor() {
        this.toLoad = {
            sky: "../public/sprites/Tilesets/Grass.png",
            g: "../public/sprites/Tilesets/Water.png"
        }

        this.images = {};

        Object.keys(this.toLoad).forEach(key => {
            const img = new Image();
            img.src = this.toLoad[key];
            this.images[key] = {
                image: img,
                isLoaded: false
            }
            img.onLoad = () => {
                this.images[key].isLoaded = true;
            }
        })
    }
}

export const resources = new Resources();