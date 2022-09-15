/**
 * 
 * @param hourString 1008 -> 18:00
 */

 export function convertMinutesToHoursString(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const currentMinutes = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
}