#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
    const ora = (await import('ora')).default;
    const inquirer = (await import('inquirer')).default;
    const installMarker = path.resolve(__dirname, '.zsh-installed');

    if (fs.existsSync(installMarker)) return selectTheme(inquirer);

    const spinner = ora('Checking system requirements...').start();

    const checkCommand = (cmd) =>
        new Promise((resolve, reject) => exec(cmd, (err) => (err ? reject(`\n${cmd.split(' ')[0]} is not installed.`) : resolve())));

    try {
        await Promise.all([checkCommand('git --version'), checkCommand('node --version')]);
        spinner.succeed('System requirements satisfied.');

        const installScriptPath = path.resolve(__dirname, 'install.sh');
        if (!fs.existsSync(installScriptPath)) throw new Error(`Installation script not found: ${installScriptPath}`);

        ora('Installing Zsh...').start().succeed(await new Promise((resolve, reject) =>
            exec(`bash "${installScriptPath}"`, (err) => err ? reject('Installation failed.') : resolve('Zsh installation completed!'))
        ));

        fs.writeFileSync(installMarker, '');
        selectTheme(inquirer);
    } catch (err) {
        spinner.fail(err.message);
        process.exit(1);
    }
})();

async function selectTheme(inquirer) {
    const { theme } = await inquirer.prompt({
        type: 'list',
        name: 'theme',
        message: 'Choose your Zsh theme:',
        choices: ['agnoster', 'robbyrussell', 'sonicradish', 'smt', 'wezm', 'Custom'],
    });

    if (theme === 'Custom') {
        const { customTheme } = await inquirer.prompt({
            type: 'input',
            name: 'customTheme',
            message: 'Enter the name of your custom Zsh theme:',
        });
        if (!fs.existsSync(path.join(process.env.HOME, `.oh-my-zsh/themes/${customTheme}.zsh-theme`))) {
            console.error(`Theme "${customTheme}" does not exist.`);
            process.exit(1);
        }
        applyTheme(customTheme);
    } else {
        applyTheme(theme);
    }
}

function applyTheme(theme) {
    exec(`sed -i 's/ZSH_THEME=".*"/ZSH_THEME="${theme}"/g' ~/.zshrc`, () => {
        console.log(`Theme set to ${theme}. Type \`zsh\` in Git Bash to activate.`);
    });
}
