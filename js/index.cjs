#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
    // Use dynamic import to load ES modules
    const ora = (await import('ora')).default;
    const chalk = (await import('chalk')).default;
    const inquirer = (await import('inquirer')).default;

    // Initialize spinner for system requirement check
    const spinner = ora({
        text: `Loading ${chalk.red('unicorns')}`,
        spinner: {
            frames: ['◜', '◝', '◞', '◟', '◜', '◝', '◞', '◟'],
            interval: 100
        }
    }).start();

    // Check for Git installation
    exec('git --version', (error) => {
        if (error) {
            spinner.fail('Git is not installed. Please install it and try again.');
            process.exit(1);
        } else {
            // Check for Node.js installation
            exec('node --version', (err) => {
                if (err) {
                    spinner.fail('Node.js is not installed. Please install it and try again.');
                    process.exit(1);
                } else {
                    spinner.succeed('System requirements satisfied.');

                    // Show spinner for long-running steps
                    const installSpinner = ora({
                        text: `Downloading Zsh...`,
                        spinner: {
                            frames: ['◜', '◝', '◞', '◟', '◜', '◝', '◞', '◟'],
                            interval: 100
                        }
                    }).start();

                    // Define and run the install.sh script
                    const installScriptPath = path.resolve(__dirname, 'install.sh');
                    if (!fs.existsSync(installScriptPath)) {
                        installSpinner.fail(`Installation script not found: ${installScriptPath}`);
                        process.exit(1);
                    }

                    // Execute the install.sh script
                    exec(`bash "${installScriptPath}"`, (installError, stdout, stderr) => {
                        if (installError) {
                            installSpinner.fail(`Installation failed: ${stderr}`);
                            process.exit(1);
                        } else {
                            // Update spinner text for next steps
                            installSpinner.text = `Loading executable files...`;
                            setTimeout(() => {
                                installSpinner.text = `Installing Zsh..., it might take a few minutes.`;
                                setTimeout(() => {
                                    installSpinner.succeed('Zsh installation completed successfully!');
                                    selectTheme(inquirer); // Prompt user to select a Zsh theme
                                }, 3000); // Simulate installation delay
                            }, 2000); // Simulate download delay
                        }
                    });
                }
            });
        }
    });
})();

async function selectTheme(inquirer) {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'theme',
            message: 'Choose your Zsh theme:',
            choices: ['agnoster', 'robbyrussell', 'sonicradish', 'smt', 'wezm', 'Custom'],
        },
    ]);

    let theme = answers.theme;

    if (theme === 'Custom') {
        const customAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'customTheme',
                message: 'Enter the name of your custom Zsh theme:',
            },
        ]);
        theme = customAnswer.customTheme;

        const themeFilePath = path.join(process.env.HOME, `.oh-my-zsh/themes/${theme}.zsh-theme`);

        if (fs.existsSync(themeFilePath)) {
            applyTheme(theme);
        } else {
            console.error(`Theme "${theme}" does not exist. Please make sure the theme is installed.`);
            process.exit(1);
        }
    } else {
        applyTheme(theme);
    }
}

function applyTheme(theme) {
    exec(`sed -i 's/ZSH_THEME=".*"/ZSH_THEME="${theme}"/g' ~/.zshrc`, () => {
        console.log(`Theme set to ${theme}.`);
        console.log('Type `zsh` in git bash to activate.');
    });
}
