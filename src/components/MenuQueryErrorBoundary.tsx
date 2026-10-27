import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Catches Convex query failures (e.g. undeployed `productImages:list`)
 * so the menu can fall back to the static catalog instead of blanking.
 */
export class MenuQueryErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Menu live images failed; using static catalog.", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
