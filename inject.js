/**
 * inject.js
 *
 * Este módulo permite injetar e executar funções JS dinamicamente nas views
 * a partir de arquivos localizados no diretório `public/js`.
 *
 * ## Como usar:
 *
 * 1. No arquivo `.pug`, chame a função usando:
 *    - Para retornar **strings**: `!= inject('nomeDaFunção')`
 *    - Para retornar **valores não textuais** (números, objetos, etc.): `#{inject('nomeDaFunção')}`
 *
 * 2. Certifique-se de exportar a função corretamente no arquivo JavaScript:
 *    ```js
 *      function nomeDaFunção() {
 *          return 'valor';
 *      }
 *      module.exports.nomeDaFunção = nomeDaFunção;
 *    ```
 *
 * ## Parâmetros:
 * - `funcName`: Nome da função a ser executada.
 * - `dirPath` (opcional): Caminho relativo dentro de `public/js`.
 * - `args` (opcional): Argumentos para a função.
 *
 * ## Comportamento:
 * - Se o diretório ou função não for encontrado, será exibida uma mensagem no console (backend).
 * - Para funções que retornam texto, use `!= inject('nomeDaFunção')` no Pug.
 * - Para outros tipos de retorno, use `#{inject('nomeDaFunção')}`.
 *
 * ## Atenção:
 * - **Strings** precisam ser usadas com `!=` para não serem escapadas no HTML.
 * - **Valores não textuais** podem ser usados com `#{}` normalmente.
 *
 * ## Exemplo de uso no `.pug`:
 * ```pug
 *  != inject('teste')  // Retorna 'abcdef' ou outro texto
 *  #{inject('teste')}   // Retorna valores não textuais (números, objetos, etc.)
 * ```
 * 
 * ## Informações:
 * - **Versão**: 1.0.0
 * - **Criador**: Cb Borges <diticseaux2@cbm.sc.gov.br>
 * - **Data**: 2025-03-11
 */

const fs = require('fs')
const path = require('path')

class Inject {

    constructor(app) {
        this.app = app
        this.requireCache = {}
    }

    /**
     * Função principal, que executa a função JS e retorna seu resultado no front
     * 
     * @param {string} funcName - Nome da função a ser executada.
     * @param {string} [dirPath=''] - Caminho relativo para o diretório onde os arquivos JS estão.
     * @param  {...any} args - Argumentos para a função.
     * @returns {string|undefined} O retorno da função ou `undefined` caso não encontrada.
     */
    inject(funcName, dirPath = '', ...args) {
        if (!funcName) {    
            const accessFromFront = (this.app.locals._accessFromFront || false)

            if (accessFromFront) {
                return '-\(1\)-'
            }
            
            console.log(`Você chamou inject sem informar o método`)
            return
        }

        const fullPath = path.resolve(__dirname, '..', 'public', 'js', dirPath)

        if (!fs.existsSync(fullPath)) {
            console.log(`Diretório ${fullPath} não encontrado`)
            return
        }

        const jsFiles = this.searchFilesInDirectory(fullPath)

        if (jsFiles.length === 0) {
            const accessFromFront = (this.app.locals._accessFromFront || false)

            if (accessFromFront) {
                return '-'
            } else {
                console.log(`Método ${funcName} não encontrado em nenhum arquivo`)
                return
            }
        }

        return this.executeFunctionFromFiles(jsFiles, funcName, args)
    }

    /**
     * Percorre recursivamente um diretório e retorna uma lista de arquivos JS
     * 
     * @param {string} dir - Caminho do diretório a ser pesquisado
     * @returns {Array<string>} Lista de caminhos dos arquivos JS encontrados
     */
    searchFilesInDirectory(dir) {
        const result = []
        
        const files = fs.readdirSync(dir)
        
        files.forEach(file => {
            const fullFilePath = path.join(dir, file)
            const stat = fs.statSync(fullFilePath)
            
            if (stat.isDirectory()) {
                result.push(...this.searchFilesInDirectory(fullFilePath))
            } else if (file.endsWith('.js')) {
                result.push(fullFilePath)
            }
        });
        
        return result
    }

    /**
     * Executa a função a partir dos arquivos JS encontrados
     * 
     * @param {Array<string>} jsFiles - Lista de arquivos JS onde a função será procurada
     * @param {string} funcName - Nome da função a ser executada
     * @param {Array} args - Argumentos para a função
     * @returns {string|undefined} O retorno da função ou `undefined` caso não encontrada
     */
    executeFunctionFromFiles(jsFiles, funcName, args) {
        for (let file of jsFiles) {
            const fileContent = fs.readFileSync(file, 'utf-8')
            
            const funcPattern = new RegExp(`function\\s+${funcName}\\s*\\(`)
            
            if (funcPattern.test(fileContent)) {
                let script;

                if (this.requireCache[file]) {
                    script = this.requireCache[file]
                } else {
                    script = require(file)
                    this.requireCache[file] = script
                }

                if (script[funcName] && typeof script[funcName] === 'function') {
                    return script[funcName](...args)
                }
            }
        }
    }
}

module.exports = function(app) {
    const injectInstance = new Inject(app)
    app.locals.inject = injectInstance.inject.bind(injectInstance)
}
