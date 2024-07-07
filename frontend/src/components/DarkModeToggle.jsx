/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, useColorMode } from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

function DarkModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button onClick={toggleColorMode} variant="outline" className="m-2 p-2 border border-gray-400 rounded" leftIcon={colorMode === 'light' ? <FiMoon /> : <FiSun />}>
            {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
    );
}

export default DarkModeToggle;
