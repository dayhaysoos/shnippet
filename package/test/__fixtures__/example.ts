// Example TypeScript file with snippets
//:snippet-start: ts-hello
function sayHello(): void {
  console.log("Hello from TypeScript!");
}
//:snippet-end:

//:snippet-start: ts-class
class Example {
  private message: string;
  constructor() {
    this.message = "This is a TypeScript class";
  }

  getMessage(): string {
    return this.message;
  }
}
//:snippet-end:
