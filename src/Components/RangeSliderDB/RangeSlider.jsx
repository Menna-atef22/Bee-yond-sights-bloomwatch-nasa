import styles from "./RangeSlider.module.css";

function RangeSlider({ labels = [], minValue, maxValue, onRangeChange }) {
    // Don't render if the data hasn't loaded yet, preventing errors
    if (labels.length === 0) {
        return <div className={styles.loading}>Loading Time Controls...</div>;
    }

    const total = labels.length;

    const handleMinChange = (e) => {
        // Ensure the min handle can't go past the max handle
        const newMinValue = Math.min(Number(e.target.value), maxValue - 1);
        onRangeChange(newMinValue, maxValue);
    };

    const handleMaxChange = (e) => {
        // Ensure the max handle can't go before the min handle
        const newMaxValue = Math.max(Number(e.target.value), minValue + 1);
        onRangeChange(minValue, newMaxValue);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.slider}>
                {/* This div highlights the selected range */}
                <div
                    className={styles.range}
                    style={{
                        left: `${(minValue / (total - 1)) * 100}%`,
                        right: `${100 - (maxValue / (total - 1)) * 100}%`,
                    }}
                />
                <input
                    type="range"
                    min={0}
                    max={total - 1}
                    value={minValue}
                    onChange={handleMinChange}
                    className={styles.thumb}
                />
                <input
                    type="range"
                    min={0}
                    max={total - 1}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className={styles.thumb}
                />
            </div>
            <div className={styles.values}>
                {/* Display the selected start and end dates */}
                <span>{labels[minValue]}</span> to <span>{labels[maxValue]}</span>
            </div>
        </div>
    );
}

export default RangeSlider;
