# base64-html-images

`base64-html-images` is a command-line interface (CLI) application that converts the `src` attributes in `img` tags inside HTML documents to a base64 string. This allows embedding images directly into the HTML file, eliminating the need for external image files.

## Usage

```
npx base64-html-images input.html output.html
```

## How it Works

The HTML tree gets traversed using [parse5](https://github.com/inikulin/parse5), img tags inside the document get checked on 2 criteria

1. The value of the src attribute is not a link
2. The script can resolve the location of the image, location of the image gets resolved relatively to the `<input>` arg

If criteria is met the image is replaced with a base64 string

The converted HTML document is saved to the specified output file, preserving the original structure and contents of the input HTML file.

## Contributing

Contributions to `base64-html-images` are welcome! If you find any issues or have ideas for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
