import typescript from 'rollup-plugin-typescript2';

export default [
    {
        input: './src/index.ts',
        output: [{
            format: 'cjs',
            file: './dist/index.cjs',
        }],
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                        declarationMap: false,
                        module: "esnext"
                    }
                }
            })
        ],
        external: ['tslib']
    },
    {
        input: './src/index.ts',
        output: [{
            format: 'es',
            file: './dist/index.mjs',
        }],
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                        declarationMap: false,
                        module: "esnext"
                    }
                }
            })
        ]
    }
]