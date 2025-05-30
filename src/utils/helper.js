export function debounce(func, wait, immediate) {
    let timeout;
    return function (...args) {
        const context = this;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export const getPagination = (resp) => {
    const { page, size, max_page, total_pages, total, last, first, visible } = resp;
    return { page, size, max_page, total_pages, total, last, first, visible }
}

export const initial = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
};



export const isEmailFormatValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};



export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


export const invert = (hex) => {
    const rgb = hexToRgb(hex);
    const thresh = 165;
    const result = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > thresh ? '#000000' : '#ffffff';
    return result;
}

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};



export const colorToStyle = (color) => {
    const colorMap = {
        "dark": "#1A202C",
        "blue": "#3B82F6",
        "red": "#EF4444",
        "green": "#34D399",
        "yellow": "#F7DC6F",
        "indigo": "#6366F1",
        "purple": "#8B5CF6",
        "cyan": "#45A0E6",
        "gray": "#64748B",
        "lime": "#84CC16",
        "pink": "#EC4899",
        "teal": "#14B8A6"
    };
    return colorMap[color];
}
export const getColor = (percentage) => {
    if (percentage >= 90) {
        return "green";
    } else if (percentage >= 75) {
        return "lime";
    } else if (percentage >= 50) {
        return "yellow";
    } else if (percentage >= 25) {
        return "cyan";
    } else if (percentage > 0) {
        return "red";
    } else {
        return "dark";
    }
};



export const daysToMilliseconds = (days) => {
    return days * 24 * 60 * 60 * 1000;
}

export const toSnakeCase = (str) => {
    return str
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .join('_');
}

export const money = (val, friction = 2) => {
    if (!val) return 0;
    const options = { useGrouping: true, maximumFractionDigits: friction };
    if (val < 0) {
        return `(${Math.abs(val).toLocaleString('id-ID', options)})`;
    }
    return val.toLocaleString('id-ID', options);
}

export const nl2br = (str) => {
    return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
}


export const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}

export const randomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export const numberFocus = (node) => {
    var empty_val = false;
    const value = node.value;
    if (node.value == '')
        empty_val = true;
    node.type = 'number';
    if (!empty_val)
        node.value = Number(value.replace(/,/g, '')); // or equivalent per locale
}

export const inputFormat = (value) => {
    return value.toLocaleString('en')
}
export const numberBlur = (node) => {
    var empty_val = false;
    const value = Number(node.value);
    if (node.value == '')
        empty_val = true;
    node.type = 'text';
    if (!empty_val)
        node.value = value.toLocaleString('en');  // or other formatting
}


export const invertColor = (hex) => {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;
    if (color.length === 3) {
        color = color.split('').map(char => char + char).join('');
    }
    if (color.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4), 16);
    const luma = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
    return luma >= 0.5 ? '#000000' : '#FFFFFF';
}

export const statusColorMap = {
    PENDING: "bg-yellow-500",
    PREPARING: "bg-blue-500",
    IN_DELIVERY: "bg-green-500",
    IN_PROGRESS: "bg-orange-500",
    COMPLETED: "bg-indigo-500",
    delivered: "bg-indigo-500",
    COMPLETE: "bg-indigo-500",
    SETTLEMENT: "bg-indigo-500",
    allocated: "bg-orange-400",
    dropping_off: "bg-orange-400",
    picked: "bg-orange-400",
    picking_up: "bg-orange-400",
    PAID: "bg-indigo-500",
}



export const groupPermissions = (permissions) => {

    const result = {};
    permissions.forEach(item => {
        const [level1, level2, actionName] = item.name.split(':');

        if (!result[level1]) {
            result[level1] = {};
        }

        if (!result[level1][level2]) {
            result[level1][level2] = { actions: [] };
        }

        result[level1][level2].actions.push({
            id: item.id,
            created_at: item.created_at,
            name: actionName,
            is_active: item.is_active
        });
    });

    return result
}