import React from "react";
import DashboardLayout from "../features/dashboard/layouts/DashboardLayout";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You could also log error to an external service here
    console.error("Uncaught error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <DashboardLayout>
          <div style={{ padding: 40 }}>
            <h2>Something went wrong</h2>
            <p>We're sorry — the app encountered an unexpected error.</p>
            <details style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.info && this.state.info.componentStack}
            </details>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn--primary" onClick={this.handleReload}>
                Reload
              </button>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
