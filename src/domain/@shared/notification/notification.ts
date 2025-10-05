export type NotificationErrorProps = {
  message: string;
  context: string;
};

export class Notification {
  private errors: NotificationErrorProps[] = [];

  addError(error: NotificationErrorProps) {
    this.errors.push(error);
  }

  getErrors(): NotificationErrorProps[] {
    return this.errors;
  }

  messages(context?: string): string {
    if (!context) {
      return this.errors
        .map((error) => `${error.context}: ${error.message}`)
        .join(",");
    }

    return this.errors
      .filter((error) => error.context === context)
      .map((error) => `${context}: ${error.message}`)
      .join(",");
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}
