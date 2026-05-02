export const rupiah = (amount: Number | string, showData: Boolean) => {
    if (!showData) return "Rp *********"
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Number(amount))
}

export const calculateFinancialHealth = (income: number, expenses: number, debt: number, receivables: number) => {
    // Guard: pemasukan tidak boleh 0 atau negatif
    if (!income || income <= 0) {
        return {
            score: 0,
            status: "Tidak sehat",
            detail: "Pemasukan tidak valid"
        };
    }

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    // 1. Cashflow
    const netCashflow = income - expenses;
    const cashflowRatio = netCashflow / income;

    let cashflowScore;
    if (cashflowRatio >= 0.5) {
        cashflowScore = 100;
    } else if (cashflowRatio <= -0.5) {
        cashflowScore = 0;
    } else {
        cashflowScore = (cashflowRatio + 0.5) * 100;
    }

    // 2. Debt
    const debtRatio = debt / income;
    const debtScore = debtRatio >= 2
        ? 0
        : (1 - (debtRatio / 2)) * 100;

    // 3. Receivable
    const receivableRatio = receivables / income;
    const receivableScore = receivableRatio >= 1
        ? 100
        : receivableRatio * 100;

    // 4. Final Score
    const finalScore =
        (cashflowScore * 0.5) +
        (debtScore * 0.3) +
        (receivableScore * 0.2);

    const score = Math.round(clamp(finalScore, 0, 100));

    // 5. Status
    let status;
    if (score <= 40) status = "Tidak sehat";
    else if (score <= 60) status = "Kurang sehat";
    else if (score <= 80) status = "Cukup sehat";
    else status = "Sangat sehat";

    return {
        score,
        status,
        breakdown: {
            cashflowScore: Math.round(cashflowScore),
            debtScore: Math.round(debtScore),
            receivableScore: Math.round(receivableScore)
        }
    };
}