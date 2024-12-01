import * as runtime from "react/jsx-runtime";

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

export const MDXContent = ({ code, components, ...props }: MDXProps) => {
  const Component = useMDXComponent(code);
  return <Component components={{ ...components }} {...props} />;
};
