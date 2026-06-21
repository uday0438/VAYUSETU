def compute_rmse(actual, predicted):
    return round(sum((a - p)**2 for a, p in zip(actual, predicted)) / len(actual) ** 0.5, 2)

def compute_mae(actual, predicted):
    return round(sum(abs(a - p) for a, p in zip(actual, predicted)) / len(actual), 2)

def compute_r2(actual, predicted):
    mean_act = sum(actual) / len(actual)
    ss_tot = sum((x - mean_act)**2 for x in actual)
    ss_res = sum((a - p)**2 for a, p in zip(actual, predicted))
    return round(1.0 - (ss_res / ss_tot) if ss_tot > 0 else 1.0, 3)