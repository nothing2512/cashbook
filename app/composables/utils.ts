export const rupiah = (amount: Number | string, showData: Boolean) => {
    if (!showData) return "Rp *********"
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Number(amount))
}

type FinancialInput = {
    shortTermAsset: number;   // A
    longTermAsset: number;    // B
    income: number;           // I
    expense: number;          // E
    debt: number;             // D (hutang + cicilan)
    receivable?: number;      // R (optional, belum dipakai di scoring utama)
    budget: number;           // BGT
    cashflow: number;         // S (gaji - cicilan - anggaran)
};

type FinancialResult = {
    score: number;            // 0 - 100
    category: "HEALTHY" | "SAFE" | "WARNING" | "DANGER";
    breakdown: {
        liquidity: number;
        debt: number;
        cashflow: number;
        budget: number;
    };
    breakdown_text: {
        liquidity: string;
        debt: string;
        cashflow: string;
        budget: string;
    };

};

function clamp(value: number, min = 0, max = 1): number {
    return Math.max(min, Math.min(max, value));
}

function percent(val: number): string {
    return `${Math.round(val * 100)}%`;
}

export function calculateFinancialHealth(shortTermAsset: number, longTermAsset: number, income: number, expenses: number, debt: number, salary: number, budget: number, instalment: number, paydayStart: number): FinancialResult {
    const A = shortTermAsset;
    const B = longTermAsset;
    const I = income;
    const E = expenses;
    const D = debt;
    const BGT = budget;
    const SLR = salary;
    const ITM = instalment;
    const now = new Date()
    const currentDay = now.getDate()

    // --- PHASE DETECTION ---
    const isBeforePayday = currentDay < paydayStart;

    // --- COMPONENTS ---
    const liquidity = E > 0 ? clamp(A + E / E) : 1;
    const debtRatio = (A + B) > 0 ? clamp(1 - D / (A + B + E)) : 0;

    // 🔥 FIX: gunakan salary sebagai baseline
    const expectedIncome = isBeforePayday ? SLR : SLR + I;

    // kalau sebelum gajian → jangan terlalu dihukum
    const cashflowRaw = (expectedIncome - ITM - BGT) / expectedIncome;

    const cashflowRatio = isBeforePayday
        ? clamp(cashflowRaw, -0.2, 1)   // kasih toleransi minus kecil
        : clamp(cashflowRaw, 0, 1);

    const budgetControl = BGT > 0 ? clamp(1 - E / BGT) : 0;

    // --- SCORE ---
    const rawScore =
        0.3 * liquidity +
        0.25 * debtRatio +
        0.25 * cashflowRatio +
        0.2 * budgetControl;

    const score = Math.round(clamp(rawScore, 0, 1) * 100);

    // --- CATEGORY ---
    let category: FinancialResult["category"];
    if (score >= 80) category = "HEALTHY";
    else if (score >= 60) category = "SAFE";
    else if (score >= 40) category = "WARNING";
    else category = "DANGER";

    // --- TEXT ---
    const liquidityText =
        E === 0
            ? "Belum ada pengeluaran, likuiditas belum terukur."
            : liquidity >= 1
                ? `Aman — aset likuid menutup ${percent(liquidity)} pengeluaran.`
                : `Terbatas — hanya ${percent(liquidity)} pengeluaran yang tertutup.`;

    const debtText =
        A + B === 0
            ? "Tidak ada aset, rasio hutang tidak bisa dihitung."
            : debtRatio >= 0.7
                ? "Sehat — hutang rendah terhadap aset."
                : debtRatio >= 0.4
                    ? "Perlu perhatian — hutang mulai membebani."
                    : "Berisiko — hutang terlalu besar.";

    const cashflowText = (() => {
        if (isBeforePayday) {
            return `Normal — belum masuk periode gajian. Evaluasi berdasarkan proyeksi (${percent(cashflowRaw)} dari gaji).`;
        }

        if (cashflowRatio > 0.2)
            return `Sehat — sisa ${percent(cashflowRatio)} dari gaji.`;

        if (cashflowRatio > 0)
            return `Tipis — sisa ${percent(cashflowRatio)} dari gaji.`;

        return `Negatif — pengeluaran melebihi gaji.`;
    })();

    const budgetText =
        BGT === 0
            ? "Budget belum ditentukan."
            : budgetControl >= 0.3
                ? "Disiplin — masih dalam batas budget."
                : budgetControl >= 0
                    ? "Hampir habis — mendekati limit."
                    : "Over budget — sudah melewati anggaran.";

    return {
        score,
        category,
        breakdown: {
            liquidity,
            debt: debtRatio,
            cashflow: cashflowRatio,
            budget: budgetControl,
        },
        breakdown_text: {
            liquidity: liquidityText,
            debt: debtText,
            cashflow: cashflowText,
            budget: budgetText,
        },
    };
}

export function format2Digit(num: number) {
    return Math.trunc(num * 100) / 100;
}

export function formatIndonesianDate(date: Date | string | number): string {
  const d = new Date(date)

  // normalize to UTC+7 (Asia/Jakarta)
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000)
  const jakarta = new Date(utc + (7 * 60 * 60 * 1000))

  const MONTHS_ID_3 = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ]

  const day = String(jakarta.getDate()).padStart(2, "0")
  const month = MONTHS_ID_3[jakarta.getMonth()]
  const year = jakarta.getFullYear()
  const hour = String(jakarta.getHours()).padStart(2, "0")
  const minute = String(jakarta.getMinutes()).padStart(2, "0")
  const second = String(jakarta.getSeconds()).padStart(2, "0")

  return `${day} ${month} ${year} ${hour}:${minute}:${second}`
}

export function hasLimit(): Boolean {
    const config = useRuntimeConfig()
    const token = useCookie('token')
    if (!token.value) return false

    const tokenData = JSON.parse(atob(`${token.value.split(".")[1]}`))
    
    if (config.public.productionEmail != tokenData.email) return true
    
    return false
}