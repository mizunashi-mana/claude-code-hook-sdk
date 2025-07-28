{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  # https://devenv.sh/packages/
  packages = [ ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    npm = {
      enable = true;
    };
  };

  # https://devenv.sh/scripts/
  scripts.install-all = {
    exec = "npm install";
  };
  scripts.lint-all = {
    exec = "pre-commit run --all-files && npm run lint:tsc";
  };

  # https://devenv.sh/git-hooks/
  git-hooks.hooks.npx-eslint = {
    enable = true;
    entry = "npx eslint --cache --fix";
    files = "\\.(js|jsx|mjs|cjs|ts|tsx|cts)$";
  };
  git-hooks.hooks.actionlint = {
    enable = true;
  };
  git-hooks.hooks.nixfmt-rfc-style = {
    enable = true;
  };
  git-hooks.hooks.pretty-format-json = {
    enable = true;
    settings = {
      autofix = true;
      no-sort-keys = true;
    };
  };

  # See full reference at https://devenv.sh/reference/options/
}
